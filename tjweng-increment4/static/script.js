$(document).ready(function() {
    $("#readMore").click(function() {
        $("#longIntro").slideDown();
        $("#readLess").show();
        $("#readMore").hide();
    });

    $("#readLess").click(function() {
        $("#longIntro").slideUp();
        $("#readMore").show();
        $("#readLess").hide();
    });

    const navLinks = $("nav a");
    let currentPath = window.location.pathname.split("/").pop();
    if (currentPath === "") currentPath = "index.html";
    navLinks.each(function() {
        if ($(this).attr("href").split("/").pop() === currentPath) {
            $(this).addClass("active");
        } else {
            $(this).removeClass("active");
        }
    });

    $("#copyYear").text(new Date().getFullYear());
});

const buyButtons = document.querySelectorAll('.buyBtn');
const formSection = document.getElementById('purchaseForm');
const selectedDateInput = document.getElementById('selectedDate');

buyButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedDateInput.value = button.getAttribute('data-date');
        formSection.style.display = 'block';
        formSection.scrollIntoView({ behavior: 'smooth' });
    });
});

formSection.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Redirecting to payment system.");
});