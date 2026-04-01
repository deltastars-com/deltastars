"""
Delta Stars - إنشاء أيقونات التطبيق الاحترافية
يعرض الشعار كاملاً مع نص Delta Stars في مربع أخضر جذاب
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
import math

SRC = "/home/ubuntu/deltastars-store/client/public/logo.jpg"
OUT_DIR = "/home/ubuntu/deltastars-store/client/public"

def create_app_icon(size: int, output_path: str):
    """إنشاء أيقونة تطبيق احترافية بالحجم المطلوب"""
    
    # فتح الشعار الأصلي
    logo = Image.open(SRC).convert("RGBA")
    
    # إنشاء خلفية مربعة بلون أخضر متدرج
    icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    
    # رسم خلفية متدرجة
    bg = Image.new("RGBA", (size, size), (0, 0, 0, 255))
    draw = ImageDraw.Draw(bg)
    
    # تدرج أخضر من الأعلى للأسفل
    for y in range(size):
        ratio = y / size
        r = int(26 + (61 - 26) * ratio)
        g = int(92 + (139 - 92) * ratio)
        b = int(42 + (55 - 42) * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
    
    # إضافة زوايا مدورة للخلفية
    radius = size // 5
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, size-1, size-1], radius=radius, fill=255)
    
    bg.putalpha(mask)
    icon.paste(bg, (0, 0), bg)
    
    # حساب حجم الشعار - يأخذ 80% من العرض
    logo_area_size = int(size * 0.80)
    
    # الشعار الأصلي له خلفية بيضاء - نزيل البيضاء ونحتفظ بالشعار
    logo_orig = Image.open(SRC).convert("RGBA")
    
    # تحويل الخلفية البيضاء لشفافة
    data = logo_orig.getdata()
    new_data = []
    for item in data:
        r, g, b, a = item
        # إذا كان اللون قريب من الأبيض أو رمادي فاتح
        if r > 200 and g > 200 and b > 200:
            new_data.append((r, g, b, 0))  # شفاف
        elif r > 220 and g > 220 and b > 200:
            new_data.append((r, g, b, 0))
        else:
            new_data.append(item)
    logo_orig.putdata(new_data)
    
    # تغيير حجم الشعار
    logo_resized = logo_orig.resize((logo_area_size, logo_area_size), Image.LANCZOS)
    
    # وضع الشعار في المنتصف
    x = (size - logo_area_size) // 2
    y = (size - logo_area_size) // 2
    
    icon.paste(logo_resized, (x, y), logo_resized)
    
    # حفظ الأيقونة
    if output_path.endswith(".ico"):
        icon_rgb = icon.convert("RGB")
        icon_rgb.save(output_path, format="ICO", sizes=[(size, size)])
    elif output_path.endswith(".png"):
        icon.save(output_path, format="PNG", optimize=True)
    
    print(f"✅ Created: {output_path} ({size}x{size})")

def create_pwa_icon(size: int, output_path: str):
    """إنشاء أيقونة PWA بخلفية صلبة وشعار كامل"""
    
    # إنشاء خلفية
    icon = Image.new("RGB", (size, size), (26, 92, 42))
    draw = ImageDraw.Draw(icon)
    
    # تدرج
    for y in range(size):
        ratio = y / size
        r = int(26 + (45 - 26) * ratio)
        g = int(92 + (120 - 92) * ratio)
        b = int(42 + (55 - 42) * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    
    # الشعار الأصلي
    logo_orig = Image.open(SRC).convert("RGBA")
    
    # إزالة الخلفية البيضاء
    data = logo_orig.getdata()
    new_data = []
    for item in data:
        r, g, b, a = item
        if r > 200 and g > 200 and b > 200:
            new_data.append((r, g, b, 0))
        else:
            new_data.append(item)
    logo_orig.putdata(new_data)
    
    # حجم الشعار 82% من الأيقونة
    logo_size = int(size * 0.82)
    logo_resized = logo_orig.resize((logo_size, logo_size), Image.LANCZOS)
    
    # توسيط
    x = (size - logo_size) // 2
    y = (size - logo_size) // 2
    
    icon.paste(logo_resized, (x, y), logo_resized)
    
    # حفظ
    icon.save(output_path, format="PNG", optimize=True)
    print(f"✅ PWA Icon: {output_path} ({size}x{size})")

# إنشاء جميع الأيقونات المطلوبة
print("🎨 إنشاء أيقونات Delta Stars...")

# favicon.ico (متعدد الأحجام)
create_app_icon(32, f"{OUT_DIR}/favicon.ico")

# أيقونات PWA
for s in [192, 512]:
    create_pwa_icon(s, f"{OUT_DIR}/icon-{s}.png")

# أيقونة Apple Touch
create_pwa_icon(180, f"{OUT_DIR}/apple-touch-icon.png")

# أيقونة 96 للأجهزة المختلفة
create_pwa_icon(96, f"{OUT_DIR}/icon-96.png")

# أيقونة 144
create_pwa_icon(144, f"{OUT_DIR}/icon-144.png")

print("\n✅ تم إنشاء جميع الأيقونات بنجاح!")
print(f"📁 الموقع: {OUT_DIR}")
