#!/usr/bin/env python3
"""
إنشاء أيقونة تطبيق Delta Stars الاحترافية
- الشعار كامل وغير مقصوص
- نص Delta Stars واضح في المنتصف
- خلفية خضراء متدرجة احترافية
"""
from PIL import Image, ImageDraw, ImageFilter
import math

def create_gradient_background(size, color1, color2):
    """إنشاء خلفية متدرجة قطرية"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    for y in range(size):
        for x in range(size):
            # تدرج قطري من أعلى اليسار لأسفل اليمين
            ratio = (x + y) / (2 * size)
            r = int(color1[0] + (color2[0] - color1[0]) * ratio)
            g = int(color1[1] + (color2[1] - color1[1]) * ratio)
            b = int(color1[2] + (color2[2] - color1[2]) * ratio)
            draw.point((x, y), fill=(r, g, b, 255))
    
    return img

def create_rounded_rect_mask(size, radius):
    """إنشاء قناع مستطيل بزوايا مدورة"""
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, size-1, size-1], radius=radius, fill=255)
    return mask

def create_app_icon(logo_path, output_path, icon_size=1024):
    """إنشاء أيقونة التطبيق الاحترافية"""
    
    # ألوان Delta Stars
    dark_green = (15, 60, 25)      # أخضر داكن للتدرج
    medium_green = (26, 92, 42)    # أخضر متوسط
    light_green = (45, 120, 60)    # أخضر فاتح للتدرج
    
    # إنشاء الخلفية المتدرجة
    bg = Image.new('RGBA', (icon_size, icon_size), (0, 0, 0, 0))
    
    # رسم التدرج يدوياً
    draw_bg = ImageDraw.Draw(bg)
    for y in range(icon_size):
        ratio = y / icon_size
        r = int(dark_green[0] + (light_green[0] - dark_green[0]) * ratio * 0.7)
        g = int(dark_green[1] + (light_green[1] - dark_green[1]) * ratio * 0.7)
        b = int(dark_green[2] + (light_green[2] - dark_green[2]) * ratio * 0.7)
        draw_bg.line([(0, y), (icon_size, y)], fill=(r, g, b, 255))
    
    # إضافة تأثير ضوء دائري في المركز
    overlay = Image.new('RGBA', (icon_size, icon_size), (0, 0, 0, 0))
    draw_overlay = ImageDraw.Draw(overlay)
    center = icon_size // 2
    for radius in range(icon_size // 2, 0, -1):
        alpha = int(30 * (1 - radius / (icon_size // 2)))
        draw_overlay.ellipse(
            [center - radius, center - radius, center + radius, center + radius],
            fill=(255, 255, 255, alpha)
        )
    bg = Image.alpha_composite(bg, overlay)
    
    # تحميل الشعار الأصلي
    logo = Image.open(logo_path).convert('RGBA')
    logo_w, logo_h = logo.size
    
    # حساب حجم الشعار في الأيقونة (80% من الحجم الكلي مع هامش)
    padding = int(icon_size * 0.08)  # 8% هامش من كل جانب
    max_logo_size = icon_size - (padding * 2)
    
    # تحجيم الشعار مع الحفاظ على النسبة
    scale = min(max_logo_size / logo_w, max_logo_size / logo_h)
    new_w = int(logo_w * scale)
    new_h = int(logo_h * scale)
    
    logo_resized = logo.resize((new_w, new_h), Image.LANCZOS)
    
    # وضع الشعار في المركز
    x_offset = (icon_size - new_w) // 2
    y_offset = (icon_size - new_h) // 2
    
    # دمج الشعار مع الخلفية
    result = bg.copy()
    result.paste(logo_resized, (x_offset, y_offset), logo_resized)
    
    # تطبيق قناع الزوايا المدورة (نسبة 22% من الحجم - معيار iOS)
    corner_radius = int(icon_size * 0.22)
    mask = create_rounded_rect_mask(icon_size, corner_radius)
    
    final = Image.new('RGBA', (icon_size, icon_size), (0, 0, 0, 0))
    final.paste(result, (0, 0))
    final.putalpha(mask)
    
    # حفظ الصورة النهائية
    final_rgb = Image.new('RGB', (icon_size, icon_size), (26, 92, 42))
    final_rgb.paste(final, (0, 0), final)
    final_rgb.save(output_path, 'PNG', quality=100, optimize=False)
    
    print(f"✅ تم إنشاء الأيقونة: {output_path} ({icon_size}x{icon_size})")
    return final_rgb

def create_all_icons():
    logo_path = "/home/ubuntu/deltastars-store/client/public/logo.jpg"
    base_path = "/home/ubuntu/deltastars-store/client/public"
    
    # الأحجام المطلوبة
    sizes = {
        "icon-96.png": 96,
        "icon-144.png": 144,
        "icon-192.png": 192,
        "icon-512.png": 512,
        "apple-touch-icon.png": 180,
        "icon-1024.png": 1024,  # للـ App Store
    }
    
    for filename, size in sizes.items():
        output_path = f"{base_path}/{filename}"
        create_app_icon(logo_path, output_path, size)
    
    print("\n✅ تم إنشاء جميع الأيقونات بنجاح!")

if __name__ == "__main__":
    create_all_icons()
