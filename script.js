const hide = document.querySelector('#hide input');
const ul = document.querySelector('ul');
const spanDelete = `<span class="delete">حذف</span>`;
const addMedicine = document.querySelector('add-medicine');
const button = document.querySelector('.button');
const nameOfMedicine = document.querySelector('#nameOfMedicine');
const frequency = document.querySelector('#frequency');
hide.addEventListener('change' , function(){
    if(hide.checked){
        ul.style.display = 'none'
    }else{
        ul.style.display = 'block'
    }
});

button.addEventListener('click', function(e) {
    e.preventDefault(); // جلوگیری از ارسال فرم

    const spanName = document.createElement('span');
    spanName.className = 'name';
    spanName.textContent = nameOfMedicine.value;
    const li = document.createElement('li');
    
    li.appendChild(spanName);
    li.innerHTML += spanDelete;

    // تبدیل مقدار فرکانس به عدد
    const frequencyValue = parseInt(frequency.value, 10); // تبدیل رشته به عدد صحیح
    if (isNaN(frequencyValue)) {
        alert('لطفاً یک عدد معتبر وارد کنید.');
        return; // خروج از تابع اگر عدد نامعتبر است
    }

    // محاسبه باقی‌مانده تقسیم فرکانس بر 24
    const remainder = frequencyValue % 24;

    // تعیین تعداد چک‌باکس‌ها بر اساس باقی‌مانده
    const checkboxCount = remainder === 0 ? 24 : remainder;

    // اضافه کردن چک‌باکس‌ها
    for (let i = 0; i < checkboxCount; i++) {
        const checkbox = document.createElement('input');
        
        checkbox.type = 'checkbox';

        checkbox.classList.add('checkbox-style');
        li.appendChild(checkbox);
    }

    ul.appendChild(li);
   
    // پاک کردن فیلدهای ورودی
    nameOfMedicine.value = '';
    frequency.value = '';
});
function saveMedicines() {
    const medicines = [];
    document.querySelectorAll('ul li').forEach(li => {
        const medicineName = li.querySelector('.name').textContent;
        const checkboxes = [...li.querySelectorAll('input[type="checkbox"]')];
        const checkboxStates = checkboxes.map(checkbox => checkbox.checked);
        medicines.push({ name: medicineName, checkboxes: checkboxStates });
    });
    localStorage.setItem('medicines', JSON.stringify(medicines));
}

// تابع برای بازیابی و نمایش لیست داروها از لوکال استوریج
function loadMedicines() {
    const medicines = JSON.parse(localStorage.getItem('medicines')) || [];
    ul.innerHTML = ''; // پاک کردن لیست فعلی
    medicines.forEach(medicine => {
        const li = document.createElement('li');
        const spanName = document.createElement('span');
        spanName.className = 'name';
        spanName.textContent = medicine.name;
        li.appendChild(spanName);
        
        // اضافه کردن چک‌باکس‌های جدید بر اساس وضعیت ذخیره شده
        medicine.checkboxes.forEach((checked, index) => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = checked; // بازگرداندن وضعیت چک شده
            checkbox.classList.add('checkbox-style');
            checkbox.dataset.index = index; // افزودن شاخص به هر چک‌باکس
            li.appendChild(checkbox);
            
            // افزودن رویداد change به هر چک‌باکس
            checkbox.addEventListener('change', function() {
                // به‌روزرسانی وضعیت چک‌باکس در آرایه و ذخیره‌سازی مجدد
                const index = this.dataset.index;
                medicine.checkboxes[index] = this.checked;
                saveMedicines();
            });
        });
        
        li.innerHTML += spanDelete;
        ul.appendChild(li);
    });
}

// فراخوانی تابع loadMedicines هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', loadMedicines);

// فراخوانی تابع saveMedicines هنگام اضافه کردن دارو جدید
button.addEventListener('click', function(e) {
    // ... کدهای قبلی شما

    saveMedicines(); // ذخیره لیست داروها پس از اضافه کردن دارو جدید
});

document.addEventListener('click', function(e) {
    if (e.target.className === 'delete') {
        const li = e.target.parentElement;
        ul.removeChild(li);
        saveMedicines(); // ذخیره لیست داروها پس از حذف دارو
    }
});