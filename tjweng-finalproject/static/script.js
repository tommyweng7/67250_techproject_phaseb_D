/*External Libraries / Resources Cited:
- jQuery 4.0 (https://code.jquery.com/) - Used for DOM manipulation and Read More/Read Less toggling
- Leaflet.js 1.9.4 (https://leafletjs.com/) - Used for interactive maps
- OpenStreetMap (https://www.openstreetmap.org/copyright) - Map tile attribution
- Carousel / slideshow logic inspired by W3Schools "How To Slideshow" tutorial (https://www.w3schools.com/howto/howto_js_slideshow.asp)
- General JS event handling and DOM manipulation patterns referenced from W3Schools JS tutorials (https://www.w3schools.com/js/)
*/

document.addEventListener('DOMContentLoaded', function() {

    /* =========================
       Calendar & Map
    ========================= */
    const calendar = document.getElementById('calendar');
    const mapContainer = document.getElementById('map');

    // Initialize Map
    if (mapContainer) {
        const map = L.map('map').setView([40.4433, -79.9436], 15);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors' // credit OSM
        }).addTo(map);

        L.marker([40.4433, -79.9436])
            .addTo(map)
            .bindPopup("<b>MonoMuse Museum</b><br>Pittsburgh, PA")
            .openPopup();
    }

    // Build Calendar
    if (calendar) {
        const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        daysOfWeek.forEach(day => {
            const header = document.createElement('div');
            header.textContent = day;
            header.style.fontWeight = 'bold';
            header.style.textAlign = 'center';
            calendar.appendChild(header);
        });

        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            const dayElem = document.createElement('div');
            dayElem.textContent = day;
            dayElem.className = 'calendar-day';

            if (dayOfWeek === 1 || dayOfWeek === 2) {
                dayElem.classList.add('closed');
            } else {
                dayElem.classList.add('open');
                dayElem.addEventListener('click', () => {
                    const selectedDate = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                    window.location.href = `checkout.html?date=${selectedDate}`;
                });
            }

            calendar.appendChild(dayElem);
        }
    }

    /* =========================
       Read More / Read Less
    ========================= */
    const readMoreBtn = document.getElementById('readMore');
    const readLessBtn = document.getElementById('readLess');
    const longIntro = document.getElementById('longIntro');

    if (readMoreBtn && readLessBtn && longIntro) {
        readMoreBtn.addEventListener('click', () => {
            longIntro.style.display = 'block';
            readLessBtn.style.display = 'inline';
            readMoreBtn.style.display = 'none';
        });

        readLessBtn.addEventListener('click', () => {
            longIntro.style.display = 'none';
            readLessBtn.style.display = 'none';
            readMoreBtn.style.display = 'inline';
        });
    }

    /* =========================
       Membership Form
    ========================= */
    const membershipForm = document.getElementById('membershipForm');
    const membershipConfirmation = document.getElementById('membershipConfirmation');
    const memberEmailInput = document.getElementById('memberEmail');

    if (membershipForm) {
        membershipForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = memberEmailInput.value.trim();
            if(email === "") {
                membershipConfirmation.style.color = "red";
                membershipConfirmation.textContent = "Please enter a valid email.";
                return;
            }
            membershipConfirmation.style.color = "green";
            membershipConfirmation.textContent = `Thanks for joining us, ${email}!`;
            membershipForm.reset();
        });
    }

    /* =========================
       Carousel
    ========================= */
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        let index = 0;

        function updateCarousel() {
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        nextBtn.addEventListener('click', () => {
            index = (index + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            index = (index - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        setInterval(() => {
            index = (index + 1) % slides.length;
            updateCarousel();
        }, 5000);
    }

});

/* =========================
   Checkout Ticket Calculation
========================= */
const visitDateInput = document.getElementById('visitDate');
const adultQty = document.getElementById('adultQty');
const studentQty = document.getElementById('studentQty');
const memberQty = document.getElementById('memberQty');
const totalPriceElem = document.getElementById('totalPrice');
const checkoutForm = document.getElementById('checkoutForm');
const messageElem = document.getElementById('checkoutMessage');

if (visitDateInput) {
    const params = new URLSearchParams(window.location.search);
    const selectedDate = params.get('date');
    if (selectedDate) visitDateInput.value = selectedDate;
}

if (adultQty && studentQty && memberQty && totalPriceElem) {
    function updateTotal() {
        const adults = parseInt(adultQty.value) || 0;
        const students = parseInt(studentQty.value) || 0;
        const members = parseInt(memberQty.value) || 0;
        const total = (adults + students + members) * 18; // $18 per ticket
        totalPriceElem.textContent = total;
    }

    // Run on input change
    adultQty.addEventListener('input', updateTotal);
    studentQty.addEventListener('input', updateTotal);
    memberQty.addEventListener('input', updateTotal);

    // Initialize total on page load
    updateTotal();
}

// Checkout form validation and submission
if (checkoutForm && totalPriceElem && messageElem) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const adults = parseInt(adultQty.value) || 0;
        const students = parseInt(studentQty.value) || 0;
        const members = parseInt(memberQty.value) || 0;
        const totalTickets = adults + students + members;

        messageElem.style.color = "red";
        messageElem.textContent = "";

        if (totalTickets === 0) {
            messageElem.textContent = "Please select at least one ticket.";
            return;
        }

        const email = document.getElementById('email').value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            messageElem.textContent = "Please enter a valid email address.";
            return;
        }

        const zip = document.getElementById('zip').value.trim();
        if (zip && !/^\d{5}$/.test(zip)) {
            messageElem.textContent = "Zip code must be exactly 5 digits.";
            return;
        }

        // Success
        alert("Your order has been successfully processed!");
        messageElem.style.color = "green";
        messageElem.textContent =
            `Order confirmed! Your total is $${totalPriceElem.textContent}. We look forward to seeing you on ${visitDateInput.value}.`;

        checkoutForm.reset();
        updateTotal(); // reset total price to 0
    });
}

// =========================
// Highlight Active Nav Link
// =========================
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav_bar a');
    const currentPath = window.location.pathname; // e.g., "/view/exhibitions.html"

    navLinks.forEach(link => {
        // Get only the filename portion from href (ignore full path)
        const linkPath = new URL(link.href).pathname;

        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
});