// --- ส่วนตั้งค่า (Config) ---
// ลิงก์ Server ของคุณ (Render)
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

// 1. ฟังก์ชันสร้าง Dropdown
function initMenu() {
    const selector = document.getElementById('menu-selector');
    const priceDisplay = document.getElementById('price-display');

    MENU_ITEMS.forEach(item => {
        const option = document.createElement('option');
        option.value = JSON.stringify(item); 
        option.textContent = `${item.icon} ${item.name}`;
        selector.appendChild(option);
    });

    selector.addEventListener('change', (e) => {
        const selectedItem = JSON.parse(e.target.value);
        priceDisplay.textContent = `${selectedItem.price} ฿`;
    });
}

// 2. ฟังก์ชันเดารูปภาพ
function getImageFromName(name) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("tea") || lowerName.includes("cha")) return IMAGES.Tea;
    if (lowerName.includes("choco") || lowerName.includes("cocoa")) return IMAGES.Choco;
    if (lowerName.includes("soda")) return IMAGES.Soda;
    if (lowerName.includes("cake") || lowerName.includes("cheese")) return IMAGES.Cake;
    if (lowerName.includes("coffee") || lowerName.includes("latte") || lowerName.includes("americano")) return IMAGES.Coffee;
    return IMAGES.Default;
}

// 3. โหลดสินค้า (GET)
async function loadProducts() {
    const loader = document.getElementById('loading');
    const list = document.getElementById('product-list');
    
    loader.style.display = 'block';
    list.innerHTML = '';

    try {
        const response = await fetch(`${BASE_URL}/api/products`);
        const data = await response.json();
        
        loader.style.display = 'none';

        if (data.length === 0) {
            list.innerHTML = `
                <div class="text-center py-10 opacity-50">
                    <i class="fa-solid fa-mug-hot text-4xl mb-2 text-gray-300"></i>
                    <p>ยังไม่มีรายการวันนี้</p>
                </div>`;
            return;
        }

        data.forEach((item) => {
            const imageUrl = getImageFromName(item.name);
            const li = document.createElement('li');
            
            // สร้าง Card แบบสวยๆ
            li.className = "group bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all duration-300";
            li.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <img src="${imageUrl}" class="w-14 h-14 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-300">
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-800 text-sm leading-tight mb-1">${item.name}</h4>
                        <div class="flex items-center gap-2">
                            <span class="text-amber-600 font-bold text-sm bg-amber-50 px-2 py-0.5 rounded-md">${item.price} ฿</span>
                        </div>
                    </div>
                </div>
                <div class="flex gap-1 pl-2">
                    <button onclick="updateProduct('${item._id}', '${item.name}', ${item.price})" 
                        class="w-9 h-9 rounded-full text-gray-400 hover:bg-amber-50 hover:text-amber-600 flex items-center justify-center transition">
                        <i class="fa-solid fa-pen text-xs"></i>
                    </button>
                    <button onclick="deleteProduct('${item._id}')" 
                        class="w-9 h-9 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition">
                        <i class="fa-solid fa-trash text-xs"></i>
                    </button>
                </div>
            `;
            list.appendChild(li);
        });

    } catch (error) {
        console.error(error);
        loader.innerHTML = '<p class="text-red-500 text-sm">เชื่อมต่อ Server ไม่ได้</p>';
    }
}

// 4. เพิ่มสินค้า (POST)
async function addProduct() {
    const selector = document.getElementById('menu-selector');
    if (!selector.value) {
        // เขย่า Dropdown เตือน
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
        await fetch(`${BASE_URL}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: selectedItem.name,
                price: selectedItem.price
            })
        });
        
        // Success Effect
        loadProducts();
        selector.value = "";
        document.getElementById('price-display').textContent = "0 ฿";

    } catch (error) {
        alert("เกิดข้อผิดพลาด");
    } finally {
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

// 6. แก้ไขสินค้า (PUT)
async function updateProduct(id, oldName, oldPrice) {
    const newPrice = prompt(`แก้ไขราคา ${oldName}:`, oldPrice);
    if (newPrice === null || newPrice === "") return;

    await fetch(`${BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: oldName, price: parseInt(newPrice) })
    });
    loadProducts();
}