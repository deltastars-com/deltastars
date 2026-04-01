from PIL import Image
import os

src = "/home/ubuntu/deltastars-store/client/public/icon-512.png"
android_res = "/home/ubuntu/deltastars-store/android/app/src/main/res"

sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

img = Image.open(src)

for folder, size in sizes.items():
    os.makedirs(f"{android_res}/{folder}", exist_ok=True)
    out = img.resize((size, size), Image.LANCZOS)
    out.save(f"{android_res}/{folder}/ic_launcher.png", "PNG")
    out.save(f"{android_res}/{folder}/ic_launcher_round.png", "PNG")
    print(f"OK {folder}: {size}x{size}")

print("Done!")
