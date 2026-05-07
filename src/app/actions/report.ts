"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadRaw } from "@/lib/upload";
import * as XLSX from "xlsx";

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

    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const dateStr = new Date().toLocaleDateString("ar-EG").replace(/\//g, "-");
    const reportTitle = `تقرير المبيعات اليومي - ${dateStr}`;

    // 2. Prepare Data for Excel
    // We create an array of objects with Arabic keys for the headers
    const data = orders.map((order) => ({
      "رقم الطلب": order.id,
      "اسم العميل": order.customerName,
      "رقم الهاتف": order.customerPhone,
      "العنوان / الملاحظات": order.customerAddress,
      "نوع الطلب": order.type === "PRESCRIPTION" ? "وصفة طبية" : "سلة مشتريات",
      "المبلغ الإجمالي": order.totalAmount,
      "حالة الطلب": order.status,
      "التاريخ والوقت": new Date(order.createdAt).toLocaleString("ar-EG"),
    }));

    // 3. Create Workbook and Worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths
    const wscols = [
      { wch: 20 }, // ID
      { wch: 20 }, // Customer
      { wch: 15 }, // Phone
      { wch: 30 }, // Address
      { wch: 15 }, // Type
      { wch: 15 }, // Amount
      { wch: 15 }, // Status
      { wch: 25 }, // Date
    ];
    worksheet["!cols"] = wscols;

    // Set Sheet to RTL (Right-to-Left)
    if (!worksheet["!views"]) worksheet["!views"] = [];
    worksheet["!views"].push({ RTL: true });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "المبيعات");

    // 4. Write to Buffer
    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
    
    // 5. Upload to Cloudinary
    const filename = `report_${Date.now()}.xlsx`;
    // We use a Blob for the uploadRaw function we created earlier
    const fileUrl = await uploadRaw(new Blob([excelBuffer]), filename, "reports");

    // 6. Save Report Record
    await prisma.report.create({
      data: {
        title: reportTitle,
        type: "DAILY",
        dateRange: dateStr,
        totalAmount,
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
  return await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });
}
