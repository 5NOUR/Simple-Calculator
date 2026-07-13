const inputValue = document.getElementById("user-input");

// دالة حسابية آمنة كبديل لـ eval
const safeEval = (str) => {
  return new Function(`return ${str}`)();
};

// 1. التعامل مع أزرار الأرقام والنقطة العشرية
const numbers = document.querySelectorAll(".number");
numbers.forEach(function (item) {
  item.addEventListener("click", function (e) {
    const clickedValue = e.currentTarget.innerHTML.trim();

    // إذا كانت الشاشة بها 0 أو NaN أو Error، صفر الشاشة
    if (["0", "NaN", "Error"].includes(inputValue.innerText)) {
      inputValue.innerText = "";
    }

    // حماية النقطة العشرية: نمنع تكرارها في نفس الرقم
    if (clickedValue === ".") {
      // نقسم الشاشة بناءً على العمليات الحسابية للحصول على "الرقم الحالي" الذي نكتبه
      const currentNumbers = inputValue.innerText.split(/[\+\-\*\/÷x]/);
      const lastNumber = currentNumbers[currentNumbers.length - 1];

      // إذا كان الرقم الأخير يحتوي بالفعل على نقطة، نمنع إضافة نقطة أخرى
      if (lastNumber.includes(".")) {
        return;
      }

      // إذا بدأت الكتابة بنقطة عشرية، ضع تلقائياً صفر قبلها (مثال: .5 تصبح 0.5)
      if (inputValue.innerText === "") {
        inputValue.innerText = "0";
      }
    }

    inputValue.innerText += clickedValue;
  });
});

// 2. التعامل مع أزرار العمليات
const operations = document.querySelectorAll(".operations");
operations.forEach(function (item) {
  item.addEventListener("click", function (e) {
    const operation = e.currentTarget.innerHTML.trim();
    let lastValue = inputValue.innerText.slice(-1);

    if (operation === "AC") {
      inputValue.innerText = "0";
    } else if (operation === "DEL") {
      // إذا كانت الشاشة تعرض خطأ أو NaN، يمسح الكل
      if (["Error", "NaN"].includes(inputValue.innerText)) {
        inputValue.innerText = "0";
      } else {
        inputValue.innerText = inputValue.innerText.slice(0, -1);
        if (inputValue.innerText.length === 0) {
          inputValue.innerText = "0";
        }
      }
    } else if (operation === "=") {
      if (
        !isNaN(lastValue) &&
        inputValue.innerText !== "" &&
        !["Error", "NaN"].includes(inputValue.innerText)
      ) {
        try {
          // استبدال علامات الضرب والقسمة المعتادة برمجياً
          let expression = inputValue.innerText
            .replace(/x/g, "*")
            .replace(/÷/g, "/");

          // الحساب الآمن
          let result = safeEval(expression);

          // التعامل مع القسمة على صفر (تنتج Infinity في JS)
          if (result === Infinity || isNaN(result)) {
            inputValue.innerText = "Error";
          } else {
            // تقريب الأرقام العشرية الطويلة لـ 4 أرقام عشرية كحد أقصى لمنع تمدد الشاشة
            inputValue.innerText = Number(result.toFixed(4));
          }
        } catch (error) {
          inputValue.innerText = "Error";
        }
      }
    } else {
      // نمنع إضافة عملية حسابية إذا كانت الشاشة تعرض خطأ
      if (["Error", "NaN"].includes(inputValue.innerText)) return;

      // إذا كان آخر مدخل هو نقطة عشرية، نمنع إضافة عملية مباشرة
      if (lastValue === ".") return;

      // منع تكرار العمليات الحسابية المتتالية
      if (!isNaN(lastValue) && inputValue.innerText !== "") {
        inputValue.innerText += operation;
      }
    }
  });
});
