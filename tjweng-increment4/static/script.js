/* =============================================================
   External Libraries & Resources
   - jQuery 4.0              https://code.jquery.com/
   - Leaflet.js 1.9.4        https://leafletjs.com/
   - OpenStreetMap tiles     https://www.openstreetmap.org/copyright
   - Carousel logic inspired by W3Schools Slideshow tutorial
                             https://www.w3schools.com/howto/howto_js_slideshow.asp
   - General JS patterns     https://www.w3schools.com/js/
============================================================= */


/* =============================================================
   ON DOM READY
   Runs after the page has fully loaded its HTML structure.
============================================================= */
document.addEventListener('DOMContentLoaded', function () {


    /* -------------------------
       Interactive Map (Leaflet)
    ------------------------- */
    const mapContainer = document.getElementById('map');

    if (mapContainer) {
        const map = L.map('map').setView([40.4433, -79.9436], 15);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([40.4433, -79.9436])
            .addTo(map)
            .bindPopup('<b>MonoMuse Museum</b><br>Pittsburgh, PA')
            .openPopup();
    }


    /* -------------------------
       Ticket Calendar
       Open: Sun, Mon, Tue, Wed, Thu
       Closed: Fri (5) and Sat (6)
    ------------------------- */
    const calendar = document.getElementById('calendar');

    if (calendar) {
        const CLOSED_DAYS = new Set([5, 6]); // Friday = 5, Saturday = 6

        // Render day-of-week headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(label => {
            const header = document.createElement('div');
            header.textContent = label;
            header.style.fontWeight = 'bold';
            header.style.textAlign = 'center';
            calendar.appendChild(header);
        });

        // Render day cells for the current month
        const today       = new Date();
        const month       = today.getMonth();
        const year        = today.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date      = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            const cell      = document.createElement('div');
            cell.textContent = day;
            cell.className   = 'calendar-day';

            if (CLOSED_DAYS.has(dayOfWeek)) {
                cell.classList.add('closed');
            } else {
                cell.classList.add('open');
                cell.addEventListener('click', () => {
                    const mm = String(month + 1).padStart(2, '0');
                    const dd = String(day).padStart(2, '0');
                    window.location.href = `checkout.html?date=${year}-${mm}-${dd}`;
                });
            }

            calendar.appendChild(cell);
        }
    }


    /* -------------------------
       Read More / Read Less Toggle
    ------------------------- */
    const readMoreBtn = document.getElementById('readMore');
    const readLessBtn = document.getElementById('readLess');
    const longIntro   = document.getElementById('longIntro');

    if (readMoreBtn && readLessBtn && longIntro) {
        readMoreBtn.addEventListener('click', () => {
            longIntro.style.display  = 'block';
            readLessBtn.style.display = 'inline';
            readMoreBtn.style.display = 'none';
        });

        readLessBtn.addEventListener('click', () => {
            longIntro.style.display  = 'none';
            readLessBtn.style.display = 'none';
            readMoreBtn.style.display = 'inline';
        });
    }


    /* -------------------------
       Membership Form
    ------------------------- */
    const membershipForm         = document.getElementById('membershipForm');
    const membershipConfirmation = document.getElementById('membershipConfirmation');
    const memberEmailInput       = document.getElementById('memberEmail');

    if (membershipForm) {
        membershipForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = memberEmailInput.value.trim();

            if (email === '') {
                membershipConfirmation.style.color = 'red';
                membershipConfirmation.textContent = 'Please enter a valid email.';
                return;
            }

            membershipConfirmation.style.color = 'green';
            membershipConfirmation.textContent = `Thanks for joining us, ${email}!`;
            membershipForm.reset();
        });
    }


    /* -------------------------
       Image Carousel
       Auto-advances every 5 seconds.
    ------------------------- */
    const track = document.querySelector('.carousel-track');

    if (track) {
        const slides  = Array.from(track.children);
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        let   index   = 0;

        function goToSlide(i) {
            index = (i + slides.length) % slides.length;
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        nextBtn.addEventListener('click', () => goToSlide(index + 1));
        prevBtn.addEventListener('click', () => goToSlide(index - 1));

        setInterval(() => goToSlide(index + 1), 5000);
    }


    /* -------------------------
       Active Nav Link Highlight
       Adds .active class to the link matching the current page.
    ------------------------- */
    const navLinks    = document.querySelectorAll('.nav_bar a');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });


    /* -------------------------
       Footer Year
    ------------------------- */
    const copyYear = document.getElementById('copyYear');
    if (copyYear) {
        copyYear.textContent = new Date().getFullYear();
    }


}); // end DOMContentLoaded


/* =============================================================
   BUY TICKETS PAGE
   showTicketForm()    — reveals the hidden purchase form and
                         pre-fills the selected date.
   handleTicketSubmit() — fires the required alert on submit.
============================================================= */

/**
 * Reveals the purchase form and sets the selected date field.
 * Called by each "Buy Now" button via onclick.
 * @param {string} date - The date string from the clicked row.
 */
function showTicketForm(date) {
    const form         = document.getElementById('purchaseForm');
    const dateInput    = document.getElementById('buyDate');

    if (!form || !dateInput) return;

    // Fill in the date and show the form
    dateInput.value = date;
    form.classList.remove('hidden-form');

    // Smoothly scroll down to the form
    form.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Handles the purchase form submit button.
 * Prevents default form submission and shows the required alert.
 * @param {Event} e
 */
function handleTicketSubmit(e) {
    e.preventDefault();
    alert('Redirecting to payment system.');
}


/* =============================================================
   CHECKOUT PAGE
   Runs immediately — handles the separate checkout.html flow.
============================================================= */

const visitDateInput  = document.getElementById('visitDate');
const adultQty        = document.getElementById('adultQty');
const studentQty      = document.getElementById('studentQty');
const memberQty       = document.getElementById('memberQty');
const totalPriceElem  = document.getElementById('totalPrice');
const checkoutForm    = document.getElementById('checkoutForm');
const messageElem     = document.getElementById('checkoutMessage');

const TICKET_PRICE = 18;


/* -------------------------
   Pre-fill Date from URL Param
   e.g. checkout.html?date=2026-04-12
------------------------- */
if (visitDateInput) {
    const params       = new URLSearchParams(window.location.search);
    const selectedDate = params.get('date');
    if (selectedDate) visitDateInput.value = selectedDate;
}


/* -------------------------
   Live Total Price Calculator
------------------------- */
if (adultQty && studentQty && memberQty && totalPriceElem) {

    function updateTotal() {
        const adults   = parseInt(adultQty.value)   || 0;
        const students = parseInt(studentQty.value) || 0;
        const members  = parseInt(memberQty.value)  || 0;
        totalPriceElem.textContent = (adults + students + members) * TICKET_PRICE;
    }

    adultQty.addEventListener('input',   updateTotal);
    studentQty.addEventListener('input', updateTotal);
    memberQty.addEventListener('input',  updateTotal);

    updateTotal();
}


/* -------------------------
   Checkout Form Validation & Submission
------------------------- */
if (checkoutForm && totalPriceElem && messageElem) {

    checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const adults       = parseInt(adultQty.value)   || 0;
        const students     = parseInt(studentQty.value) || 0;
        const members      = parseInt(memberQty.value)  || 0;
        const totalTickets = adults + students + members;

        messageElem.style.color = 'red';
        messageElem.textContent = '';

        if (totalTickets === 0) {
            messageElem.textContent = 'Please select at least one ticket.';
            return;
        }

        const email        = document.getElementById('email').value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            messageElem.textContent = 'Please enter a valid email address.';
            return;
        }

        const zip = document.getElementById('zip').value.trim();
        if (zip && !/^\d{5}$/.test(zip)) {
            messageElem.textContent = 'Zip code must be exactly 5 digits.';
            return;
        }

        alert('Your order has been successfully processed!');
        messageElem.style.color = 'green';
        messageElem.textContent =
            `Order confirmed! Your total is $${totalPriceElem.textContent}. ` +
            `We look forward to seeing you on ${visitDateInput.value}.`;

        checkoutForm.reset();
        updateTotal();
    });
}