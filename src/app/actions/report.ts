"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadRaw } from "@/lib/upload";
import * as XLSX from "xlsx";

async function generateReportId(): Promise<string> {
  const date = new Date();
  const dd = date.getDate().toString().padStart(2, '0');
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const yy = date.getFullYear().toString().slice(-2);
  const prefix = `REP-${dd}${mm}${yy}`;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const todayCount = await (prisma as any).report.count({
    where: { createdAt: { gte: startOfDay, lte: endOfDay } },
  });

  const seq = (todayCount + 1).toString().padStart(4, '0');
  return `${prefix}-${seq}`;
}

export async function generateDailyReport() {
  try {
    // 1. Get all orders currently in DB
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (orders.length === 0) {
      return { success: false, error: "لا توجد طلبات جديدة لتوليد تقرير عنها" };
    }

    const dateStr = new Date().toLocaleDateString("ar-EG").replace(/\//g, "-");
    const reportTitle = `تقرير الطلبات اليومي - ${dateStr}`;

    // 2. Prepare Data for Excel (Full Details)
    const data = orders.map((order) => {
      // Format items list: "Medicine A (x2), Medicine B (x1)"
      const itemsList = order.items.length > 0 
        ? order.items.map(item => `${item.productName} (x${item.quantity})`).join(", ")
        : (order.type === "PRESCRIPTION" ? "طلب عبر صورة وصفة" : "سلة فارغة");

      return {
        "رقم الطلب": order.id,
        "اسم العميل": order.customerName,
        "رقم الهاتف": order.customerPhone,
        "العنوان / الملاحظات": order.customerAddress,
        "الأدوية المطلوبة": itemsList,
        "نوع الطلب": order.type === "PRESCRIPTION" ? "وصفة طبية" : "سلة مشتريات",
        "رابط الوصفة (إن وجد)": order.image || "لا يوجد",
        "حالة الطلب": order.status,
        "التاريخ والوقت": new Date(order.createdAt).toLocaleString("ar-EG"),
      };
    });

    // 3. Create Workbook and Worksheet with Formal Header
    const header = [
      ["صيدلية القدس"],
      ["تقرير الطلبات الرسمي"],
      [`تاريخ توليد التقرير: ${new Date().toLocaleString("ar-EG")}`],
      [`إجمالي الطلبات: ${orders.length} طلب`],
      [],
      ["رقم الطلب", "اسم العميل", "رقم الهاتف", "العنوان / الملاحظات", "الأدوية المطلوبة", "نوع الطلب", "رابط الوصفة", "حالة الطلب", "التاريخ والوقت"]
    ];

    // Convert data objects to arrays for aoa_to_sheet
    const rows = data.map(item => [
      item["رقم الطلب"],
      item["اسم العميل"],
      item["رقم الهاتف"],
      item["العنوان / الملاحظات"],
      item["الأدوية المطلوبة"],
      item["نوع الطلب"],
      item["رابط الوصفة (إن وجد)"],
      item["حالة الطلب"],
      item["التاريخ والوقت"]
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([...header, ...rows]);
    
    // Set column widths (Enhanced for more content)
    const wscols = [
      { wch: 18 }, { wch: 18 }, { wch: 15 }, { wch: 25 },
      { wch: 45 }, { wch: 15 }, { wch: 35 }, { wch: 15 }, { wch: 25 },
    ];
    worksheet["!cols"] = wscols;

    // Set Sheet to RTL
    if (!worksheet["!views"]) worksheet["!views"] = [];
    worksheet["!views"].push({ RTL: true });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "تقرير المبيعات");

    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    
    // 4. Upload to Cloudinary
    const filename = `report_${Date.now()}.xlsx`;
    const fileUrl = await uploadRaw(new Blob([excelBuffer]), filename, "pharmacy/reports");

    // 5. Generate Custom ID and Save Report
    const reportId = await generateReportId();
    await (prisma as any).report.create({
      data: {
        id: reportId,
        title: reportTitle,
        type: "DAILY",
        dateRange: dateStr,
        ordersCount: orders.length,
        fileUrl,
      },
    });

    // 7. Delete processed orders (User request)
    const orderIds = orders.map(o => o.id);
    await prisma.order.deleteMany({
      where: {
        id: { in: orderIds }
      }
    });

    revalidatePath("/adcpanforpharmacyquds/reports");
    revalidatePath("/adcpanforpharmacyquds/orders");
    revalidatePath("/adcpanforpharmacyquds");

    return { success: true, url: fileUrl };
  } catch (error) {
    console.error("Excel Report generation failed:", error);
    return { success: false, error: "فشل في توليد تقرير الإكسل" };
  }
}

export async function getReports() {
  return await (prisma as any).report.findMany({
    orderBy: { createdAt: "desc" },
  });
}
