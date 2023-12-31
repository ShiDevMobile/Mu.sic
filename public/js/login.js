const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

$("button[type='button']").addEventListener("click", async function (e) {
    const form = document.forms[0];
    const jsonData = await fetch("/login", {
        method: "POST",
        body: JSON.stringify([form.email.value, form.password.value]),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const response = await jsonData.json();
    console.log(response);

    if (response.status === "success") {
        sessionStorage.setItem("token", JSON.stringify(response.token));
        $(".msg").innerText = response.msg;
        $(".msg").style.color = "white";
        setTimeout(() => {
            window.location.href = "/";
        }, 3000);
    } else {
        $(".msg").innerText = response.msg;
        $(".msg").style.color = "white";
    }
});
