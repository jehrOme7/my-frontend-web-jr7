// --- ตั้งค่า ---
const BASE_URL = 'https://my-api-server-jr7.onrender.com';

// ข้อมูลเมนู (Mock Data สำหรับ Dropdown)
const MENU_ITEMS = [
    { name: "Iced Americano", price: 60, icon: "☕", category: "Coffee" },
    { name: "Iced Latte", price: 70, icon: "🥛", category: "Coffee" },
    { name: "Cappuccino", price: 75, icon: "🥯", category: "Coffee" },
    { name: "Caramel Macchiato", price: 85, icon: "🍯", category: "Coffee" },
    { name: "Green Tea Latte", price: 65, icon: "🍵", category: "Tea" },
    { name: "Thai Tea", price: 55, icon: "🧡", category: "Tea" },
    { name: "Peach Tea", price: 60, icon: "🍑", category: "Tea" },
    { name: "Cocoa Rich", price: 65, icon: "🍫", category: "Choco" },
    { name: "Strawberry Soda", price: 50, icon: "🍓", category: "Soda" },
    { name: "Blueberry Cheesecake", price: 120, icon: "🍰", category: "Cake" }
];

// รูปภาพสวยๆ จาก Unsplash
const IMAGES = {
    "Coffee": "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80",
    "Tea": "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=500&q=80",
    "Choco": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80",
    "Soda": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80",
    "Cake": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80",
    "Default": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80"
};

// --- เริ่มต้นทำงาน ---
initMenu();
loadProducts();

// --- ฟังก์ชันต่างๆ ---

// 1. ฟังก์ชันสร้าง Dropdown เมนู
function initMenu() {
    const selector = document.getElementById('menu-selector');
    const priceDisplay = document.getElementById('price-display');

    if (!selector) return;

    // เคลียร์และสร้างตัวเลือกใหม่
    selector.innerHTML = '<option value="" disabled selected>แตะเพื่อเลือกเครื่องดื่ม...</option>';

    MENU_ITEMS.forEach(item => {
        const option = document.createElement('option');
        option.value = JSON.stringify(item); 
        option.textContent = `${item.icon} ${item.name}`;
        selector.appendChild(option);
    });

    // เมื่อเลือกเมนู ให้เปลี่ยนราคาอัตโนมัติ
    selector.addEventListener('change', (e) => {
        const selectedItem = JSON.parse(e.target.value);
        priceDisplay.textContent = `${selectedItem.price} ฿`;
    });
}

// 2. ฟังก์ชันเลือกรูปภาพให้ตรงกับชื่อเมนู
function getImageFromName(name) {
    if (!name) return IMAGES.Default;
    const lowerName = name.toLowerCase();
    if (lowerName.includes("tea") || lowerName.includes("cha")) return IMAGES.Tea;
    if (lowerName.includes("choco") || lowerName.includes("cocoa")) return IMAGES.Choco;
    if (lowerName.includes("soda")) return IMAGES.Soda;
    if (lowerName.includes("cake") || lowerName.includes("cheese")) return IMAGES.Cake;
    if (lowerName.includes("coffee") || lowerName.includes("latte") || lowerName.includes("americano")) return IMAGES.Coffee;
    return IMAGES.Default;
}

// 3. โหลดสินค้าจาก Server (GET)
async function loadProducts() {
    const loader = document.getElementById('loading');
    const list = document.getElementById('product-list');
    
    if (loader) loader.style.display = 'block'; // โชว์ Loading
    if (list) list.innerHTML = ''; // เคลียร์ของเก่า

    try {
        const response = await fetch(`${BASE_URL}/api/products`);
        const data = await response.json();
        
        if (loader) loader.style.display = 'none'; // ซ่อน Loading

        if (data.length === 0) {
            list.innerHTML = `<div class="col-span-1 sm:col-span-2 text-center py-10 opacity-50"><p>ยังไม่มีรายการวันนี้</p></div>`;
            return;
        }

        data.forEach((item) => {
            const imageUrl = getImageFromName(item.name);
            const li = document.createElement('li');
            
            // สร้าง Card แสดงผลสินค้า
            li.className = "bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all duration-300";
            
            // คำนวณจำนวนแก้วย้อนกลับ (เพื่อโชว์ x2, x3)
            const baseItem = MENU_ITEMS.find(m => m.name === item.name);
            let qtyText = "";
            
            if (baseItem && baseItem.price > 0) {
                const qty = Math.round(item.price / baseItem.price);
                if(qty > 1) qtyText = `<span class="ml-2 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">x${qty}</span>`;
            }

            li.innerHTML = `
                <div class="flex items-center gap-3">
                    <img src="${imageUrl}" class="w-14 h-14 rounded-xl object-cover shadow-sm">
                    <div>
                        <h4 class="font-bold text-gray-800 text-sm mb-1 flex items-center">${item.name} ${qtyText}</h4>
                        <span class="text-amber-600 font-bold text-sm bg-amber-50 px-2 py-0.5 rounded-md">${item.price} ฿</span>
                    </div>
                </div>
                <div class="flex gap-1 pl-2">
                    <button onclick="updateProduct('${item._id}', '${item.name}', ${item.price})" class="w-9 h-9 rounded-full text-gray-400 hover:bg-amber-50 hover:text-amber-600 flex items-center justify-center transition"><i class="fa-solid fa-pen text-xs"></i></button>
                    <button onclick="deleteProduct('${item._id}')" class="w-9 h-9 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition"><i class="fa-solid fa-trash text-xs"></i></button>
                </div>
            `;
            list.appendChild(li);
        });

    } catch (error) {
        console.error(error);
        if (loader) loader.innerHTML = '<p class="text-red-500 text-sm">เชื่อมต่อ Server ไม่ได้</p>';
    }
}

// 4. เพิ่มสินค้า (POST) - แบบฉลาด (รวมราคาถ้ามีอยู่แล้ว)
async function addProduct() {
    const selector = document.getElementById('menu-selector');
    if (!selector.value) {
        selector.classList.add('ring-2', 'ring-red-400');
        setTimeout(() => selector.classList.remove('ring-2', 'ring-red-400'), 500);
        return;
    }

    const selectedItem = JSON.parse(selector.value);
    const btn = document.querySelector('button[onclick="addProduct()"]');
    
    // เปลี่ยนปุ่มเป็น Loading
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
    btn.disabled = true;

    try {
        // 1. ดึงข้อมูลเก่ามาก่อน เพื่อเช็คว่ามีเมนูนี้อยู่แล้วไหม
        const response = await fetch(`${BASE_URL}/api/products`);
        const currentProducts = await response.json();

        // 2. ค้นหาว่ามีชื่อนี้ไหม
        const existingItem = currentProducts.find(p => p.name === selectedItem.name);

        if (existingItem) {
            // A. ถ้ามีอยู่แล้ว -> ให้เอา "ราคาเดิม + ราคาใหม่" (เหมือน x2)
            const newPrice = existingItem.price + selectedItem.price;
            
            await fetch(`${BASE_URL}/api/products/${existingItem._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: selectedItem.name, price: newPrice })
            });

        } else {
            // B. ถ้ายังไม่มี -> สร้างใหม่ (POST)
            await fetch(`${BASE_URL}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: selectedItem.name, price: selectedItem.price })
            });
        }
        
        loadProducts(); // โหลดหน้าจอใหม่
        selector.value = "";
        document.getElementById('price-display').textContent = "0 ฿";

    } catch (error) {
        alert("เกิดข้อผิดพลาด");
    } finally {
        // คืนค่าปุ่ม
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
}

// 5. ลบสินค้า (DELETE)
async function deleteProduct(id) {
    if(!confirm("ลบรายการนี้?")) return;
    await fetch(`${BASE_URL}/api/products/${id}`, { method: 'DELETE' });
    loadProducts();
}

// 6. แก้ไขจำนวนแก้ว (PUT) - ถามจำนวนแล้วคูณราคาให้
async function updateProduct(id, currentName, currentPrice) {
    // 1. หาว่าเมนูนี้ ราคาต่อแก้ว จริงๆ คือเท่าไหร่
    const menu = MENU_ITEMS.find(m => m.name === currentName);
    let unitPrice = currentPrice; // ค่า default เผื่อหาไม่เจอ

    if (menu) {
        unitPrice = menu.price;
    }

    // 2. ถามจำนวนแก้ว
    const quantity = prompt(`ระบุจำนวนแก้วสำหรับ ${currentName}\n(ราคาต่อแก้ว: ${unitPrice} บาท):`, "1");

    if (quantity === null || quantity === "") return;

    const qtyNumber = parseInt(quantity);
    if (isNaN(qtyNumber) || qtyNumber <= 0) {
        alert("กรุณากรอกจำนวนให้ถูกต้อง");
        return;
    }

    // 3. คำนวณราคารวมใหม่
    const newTotalPrice = unitPrice * qtyNumber;

    // 4. บันทึก
    try {
        await fetch(`${BASE_URL}/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: currentName, price: newTotalPrice })
        });
        loadProducts();
    } catch (error) {
        alert("แก้ไขไม่ได้");
    }
}