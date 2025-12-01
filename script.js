// ใช้ลิงก์จาก Render (ไม่ใช่ localhost แล้วนะ!)
const BASE_URL = 'https://my-api-server-jr7.onrender.com';

async function loadProducts() {
    try {
        const response = await fetch(`${BASE_URL}/api/products`);
        const data = await response.json();

        const listContainer = document.getElementById('product-list');
        listContainer.innerHTML = '';

        data.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.textContent = item.name + " - ราคา " + item.price + " บาท ";
            
            // ปุ่มแก้ไข
            const editBtn = document.createElement('button');
            editBtn.textContent = "แก้ไข ✏️";
            editBtn.style.marginLeft = "10px";
            editBtn.style.background = "#ffc107";
            editBtn.style.cursor = "pointer";
            editBtn.onclick = () => updateProduct(item._id, item.name, item.price);

            // ปุ่มลบ
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = "ลบ ❌";
            deleteBtn.style.marginLeft = "10px";
            deleteBtn.style.background = "red";
            deleteBtn.style.color = "white";
            deleteBtn.style.cursor = "pointer";
            deleteBtn.onclick = () => deleteProduct(item._id);

            listItem.appendChild(editBtn);
            listItem.appendChild(deleteBtn);
            listContainer.appendChild(listItem);
        });
    } catch (error) {
        console.error("โหลดสินค้าไม่ได้:", error);
    }
}

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

    try {
        await fetch(`${BASE_URL}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });

        alert("เพิ่มเรียบร้อย!");
        loadProducts();
        document.getElementById('product-name').value = '';
        document.getElementById('product-price').value = '';
    } catch (error) {
        alert("เพิ่มไม่ได้ มีปัญหาบางอย่าง");
    }
}

async function deleteProduct(id) {
    if(!confirm("จะลบจริงๆ หรอ?")) {
        return;
    }

    await fetch(`${BASE_URL}/api/products/${id}`, {
        method: 'DELETE'
    });

    loadProducts();
}

async function updateProduct(id, oldName, oldPrice) {
    const newName = prompt("แก้ชื่อสินค้า:", oldName);
    if (newName === null || newName === "") return;

    const newPrice = prompt("แก้ราคา:", oldPrice);
    if (newPrice === null || newPrice === "") return;

    const updateData = {
        name: newName,
        price: parseInt(newPrice)
    };

    try {
        const response = await fetch(`${BASE_URL}/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        if (response.ok) {
            alert("แก้ไขเสร็จแล้ว! ✨");
            loadProducts();
        }
    } catch (error) {
        alert("แก้ไขไม่ได้ มีปัญหาบางอย่าง");
    }
}

// เริ่มทำงาน
loadProducts();