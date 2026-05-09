"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/upload";

async function generateOrderId(): Promise<string> {
  const date = new Date();
  const dd = date.getDate().toString().padStart(2, '0');
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const yy = date.getFullYear().toString().slice(-2);
  const prefix = `ORD-${dd}${mm}${yy}`;

  // Count orders created today to get sequential number
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const todayCount = await prisma.order.count({
    where: { createdAt: { gte: startOfDay, lte: endOfDay } },
  });

  const seq = (todayCount + 1).toString().padStart(4, '0');
  return `${prefix}-${seq}`;
}

type OrderItemInput = {
  productId?: string;
  productName: string;
  quantity: number;
};

export async function createOrder(data: {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItemInput[];
}) {
  try {
    const orderId = await generateOrderId();
    const order = await prisma.order.create({
      data: {
        id: orderId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        type: "CART",
        items: {
          create: data.items.map((item) => {
            const isValidId = typeof item.productId === 'string' && item.productId.length > 10;
            return {
              productId: isValidId ? item.productId : null,
              productName: item.productName,
              quantity: item.quantity,
            };
          }),
        },
      },
    });

    revalidatePath("/adcpanforpharmacyquds/orders");
    revalidatePath("/adcpanforpharmacyquds");

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Failed to create order:", error);
    return { success: false, error: "فشل في حفظ الطلب" };
  }
}

export async function createPrescriptionOrder(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;
    const imageFile = formData.get("image") as File;

    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile, "pharmacy/prescriptions");
    }

    const orderId = await generateOrderId();
    const order = await prisma.order.create({
      data: {
        id: orderId,
        customerName: name,
        customerPhone: phone,
        customerAddress: notes,
        type: "PRESCRIPTION",
        image: imageUrl,
      },
    });

    revalidatePath("/adcpanforpharmacyquds/orders");
    revalidatePath("/adcpanforpharmacyquds");

    return { success: true, orderId: order.id, imageUrl };
  } catch (error) {
    console.error("Failed to create prescription:", error);
    return { success: false, error: "فشل في إرسال الوصفة" };
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    await prisma.order.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/adcpanforpharmacyquds/orders");
    revalidatePath("/adcpanforpharmacyquds");

    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "فشل في تحديث الحالة" };
  }
}
