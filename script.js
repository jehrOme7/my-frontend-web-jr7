// ฟังก์ชันโหลดสินค้า (GET)
// ฟังก์ชันโหลดสินค้า (GET)
async function loadProducts() {
    // 1. ดึงข้อมูลจาก Server
    const response = await fetch('http://localhost:3000/api/products');
    const data = await response.json();

    // 2. เคลียร์รายการเก่าทิ้งก่อน
    const listContainer = document.getElementById('product-list');
    listContainer.innerHTML = '';

    // 3. วนลูปสร้างรายการสินค้า
    data.forEach((item) => {
        const listItem = document.createElement('li');
        
        // ข้อความสินค้า
        listItem.textContent = item.name + " - ราคา " + item.price + " บาท ";
        
        // --- ส่วนปุ่มแก้ไข (ของใหม่) ---
        const editBtn = document.createElement('button');
        editBtn.textContent = "แก้ไข ✏️";
        editBtn.style.marginLeft = "10px";
        editBtn.style.background = "#ffc107"; // สีเหลือง
        editBtn.style.cursor = "pointer";
        // เมื่อกดจะเรียกฟังก์ชัน updateProduct
        editBtn.onclick = () => updateProduct(item._id, item.name, item.price);

        // --- ส่วนปุ่มลบ (ของเดิม) ---
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "ลบ ❌";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.style.background = "red";
        deleteBtn.style.color = "white";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.onclick = () => deleteProduct(item._id);

        // ยัดปุ่มใส่เข้าไปในบรรทัด (เรียงลำดับ: แก้ไข -> ลบ)
        listItem.appendChild(editBtn);
        listItem.appendChild(deleteBtn);
        
        listContainer.appendChild(listItem);
    });
}

// ฟังก์ชันเพิ่มสินค้า (POST)
async function addProduct() {
    const nameInput = document.getElementById('product-name').value;
    const priceInput = document.getElementById('product-price').value;

    if(!nameInput || !priceInput) {
        alert("กรุณากรอกข้อมูลให้ครบ!");
        return;
    }

    const newProduct = {
        name: nameInput,
        price: parseInt(priceInput)
    };

    await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
    });

    alert("เพิ่มเรียบร้อย!");
    loadProducts(); // โหลดรายการใหม่
    
    // เคลียร์ช่องกรอก
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
}

// ฟังก์ชันลบสินค้า (DELETE)
async function deleteProduct(id) {
    if(!confirm("จะลบจริงๆ หรอ?")) {
        return;
    }

    await fetch('http://localhost:3000/api/products/' + id, {
        method: 'DELETE'
    });

    loadProducts(); // โหลดรายการใหม่
}

// เรียกทำงานครั้งแรกตอนเปิดเว็บ
loadProducts();

async function updateProduct(id, oldName, oldPrice) {
    // 1. เด้งกล่องถามชื่อใหม่ (ใส่ค่าเดิมรอไว้ให้เลย)
    const newName = prompt("แก้ชื่อสินค้า:", oldName);
    
    // ถ้ากด Cancel หรือไม่พิมพ์อะไรมา ก็จบฟังก์ชัน
    if (newName === null || newName === "") return;

    // 2. เด้งกล่องถามราคาใหม่
    const newPrice = prompt("แก้ราคา:", oldPrice);
    if (newPrice === null || newPrice === "") return;

    // 3. เตรียมข้อมูลแพ็คใส่กล่อง
    const updateData = {
        name: newName,
        price: parseInt(newPrice)
    };

    // 4. ส่งไปหา Server (ใช้ method PUT)
    try {
        const response = await fetch('http://localhost:3000/api/products/' + id, {
            method: 'PUT', // บอกว่าเป็นแก้ไข
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        if (response.ok) {
            alert("แก้ไขเสร็จแล้ว! ✨");
            loadProducts(); // โหลดหน้าจอใหม่
        }
    } catch (error) {
        alert("มีบางอย่างผิดพลาด");
    }
}