document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("appointmentForm");
    const userMessage = document.getElementById("userMessage");

    // ۱. پڕکردنەوەی فۆڕم لەلایەن نەخۆش
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const appointments = JSON.parse(localStorage.getItem("doctor_appointments")) || [];

            const newAppointment = {
                id: Date.now(),
                fullName: document.getElementById("fullName").value,
                phone: document.getElementById("phone").value,
                date: document.getElementById("appointmentDate").value,
                notes: document.getElementById("notes").value || "هیچ تێبینییەک نییە",
                status: "چاوەڕوانکراوە"
            };

            appointments.push(newAppointment);
            localStorage.setItem("doctor_appointments", JSON.stringify(appointments));

            form.reset();
            userMessage.innerText = "داواکارییەکەت بەسەرکەوتوویی نێردرا! سکرتێر پێداچوونەوەی بۆ دەکات.";
            userMessage.classList.remove("hidden");

            setTimeout(() => {
                userMessage.classList.add("hidden");
            }, 4000);
        });
    }

    // ۲. ئەگەر لە پەڕەی سکرتێر بێت، خشتەکە نیشان بدە
    if (document.getElementById("appointmentsList")) {
        renderAppointments();
    }
});

// پشکنینی پاشۆردی سکرتێر
function checkPassword() {
    const passwordInput = document.getElementById("adminPassword").value;
    const loginBox = document.getElementById("loginBox");
    const adminContent = document.getElementById("adminContent");
    const loginError = document.getElementById("loginError");

    // پاشۆردەکە لێرەدا دیاری کراوە (دەتوانیت بیگۆڕیت)
    if (passwordInput === "1234") {
        loginBox.classList.add("hidden");
        adminContent.classList.remove("hidden");
        renderAppointments();
    } else {
        loginError.style.display = "block";
    }
}

// ڕێنوماییکردن و نیشاندانی نۆرەکان بۆ سکرتێر
function renderAppointments() {
    const appointmentsList = document.getElementById("appointmentsList");
    if (!appointmentsList) return;

    let appointments = JSON.parse(localStorage.getItem("doctor_appointments")) || [];
    appointmentsList.innerHTML = "";

    if (appointments.length === 0) {
        appointmentsList.innerHTML = `<tr><td colspan="6" style="text-align:center;">هیچ داواکارییەکی نۆرە لە سیستەمدا نییە.</td></tr>`;
        return;
    }

    appointments.forEach(app => {
        let statusClass = "status-pending";
        if (app.status === "تەئکیدکرایەوە") statusClass = "status-approved";
        if (app.status.includes("داواکراوە")) statusClass = "status-rescheduled";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${app.fullName}</strong></td>
            <td>${app.phone}</td>
            <td>${app.date}</td>
            <td>${app.notes}</td>
            <td><span class="status-badge ${statusClass}">${app.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-action btn-approve" onclick="changeStatus(${app.id}, 'تەئکیدکرایەوە')">قبوڵکردن</button>
                    <button class="btn-action btn-delay" onclick="changeStatus(${app.id}, 'پاشخرا')">گۆڕینی بەروار</button>
                    <button class="btn-action btn-delete" onclick="deleteAppointment(${app.id})">سڕینەوە</button>
                </div>
            </td>
        `;
        appointmentsList.appendChild(tr);
    });
}

// گۆڕینی باری نۆرە (قبوڵکردن / گۆڕینی بەروار)
function changeStatus(id, action) {
    let appointments = JSON.parse(localStorage.getItem("doctor_appointments")) || [];

    appointments = appointments.map(app => {
        if (app.id === id) {
            if (action === 'تەئکیدکرایەوە') {
                app.status = 'تەئکیدکرایەوە';
            } else if (action === 'پاشخرا') {
                const newDate = prompt("تکایە بەروارێکی نوێ بنووسە (نموونە: 2026-05-15):");
                if (newDate) {
                    app.date = newDate;
                    app.status = `داواکراوە بۆ بەرواری (${newDate})`;
                }
            }
        }
        return app;
    });

    localStorage.setItem("doctor_appointments", JSON.stringify(appointments));
    renderAppointments();
}

// سڕینەوەی نۆرە
function deleteAppointment(id) {
    if (confirm("ئایا دڵنیایت لە سڕینەوەی ئەم نۆرەیە؟")) {
        let appointments = JSON.parse(localStorage.getItem("doctor_appointments")) || [];
        appointments = appointments.filter(app => app.id !== id);
        localStorage.setItem("doctor_appointments", JSON.stringify(appointments));
        renderAppointments();
    }
}