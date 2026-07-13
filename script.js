console.log("Portfolio Loaded");

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if(menuBtn && navLinks){
    menuBtn.onclick = () => {
        navLinks.classList.toggle("active");
    };
}
const themeIcon = document.getElementById("themeIcon");

themeIcon.onclick = function(){

    document.body.classList.toggle("dark");

    console.log(document.body.classList);

    if(document.body.classList.contains("dark")){

        themeIcon.classList.replace("fa-moon","fa-sun");

    }else{

        themeIcon.classList.replace("fa-sun","fa-moon");

    }

}
// const themeIcon = document.getElementById("themeIcon");

// console.log(themeIcon);

// themeIcon.onclick = function(){

//     alert("Dark mode clicked");

// }