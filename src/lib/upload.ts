/**
 * Image Upload Utility — Cloudinary
 * 
 * مزود رفع الصور: Cloudinary (مجاني حتى 25GB)
 * الإعداد:
 *   1. سجّل في cloudinary.com
 *   2. اذهب إلى Settings > Upload > Upload Presets > Add unsigned preset
 *   3. أضف المتغيرات في Vercel:
 *      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *      NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
 */

export async function uploadImage(file: File, folder: string = 'pharmacy'): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.warn('Cloudinary غير مُهيَّأ — سيُستخدم الرابط الافتراضي');
    return '/products/default.jpg';
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    throw new Error('فشل في رفع الملف إلى Cloudinary');
  }

  const data = await res.json();
  return data.secure_url as string;
}

export async function uploadRaw(file: Blob, filename: string, folder: string = 'reports'): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration missing');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);
  formData.append('public_id', filename); // Keep extension

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const error = await res.text();
    console.error('Cloudinary upload error:', error);
    throw new Error('فشل في رفع التقرير إلى Cloudinary');
  }

  const data = await res.json();
  return data.secure_url as string;
}
