let ctaBtn = document.querySelector(".cta-btn");
let ctaBtn1 = document.querySelector(".course-btn");

let modal = document.getElementById("contactModal");
let buttons = document.querySelectorAll(".cta-btn, .course-btn");
let closeModal = document.querySelector(".close-btn");


// hamburguer menu
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');

  const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isExpanded));
});

menuToggle.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    navLinks.classList.toggle('active');

    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
  }
});






buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        modal.style.display = "flex";
    });
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

const getNextSaturday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Domingo) a 6 (Sábado)
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7; // Garante que sempre pega o próximo sábado
    now.setDate(now.getDate() + daysUntilSaturday); // Avança para o próximo sábado
    now.setHours(23, 59, 59, 999); // Define para 23:59:59 do sábado
    return now.getTime();
};

// Define a data final como o próximo sábado
const endTime = getNextSaturday();

// Função do contador regressivo
const countdown = () => {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance <= 0) {
        clearInterval(x);
        document.querySelector(".scarcity").innerHTML = "Oferta encerrada!";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("day").innerHTML = days;
    document.getElementById("hour").innerHTML = hours;
    document.getElementById("min").innerHTML = minutes;
    document.getElementById("seg").innerHTML = seconds;
};

// Executa a função imediatamente e depois a cada 1 segundo
countdown();
const x = setInterval(countdown, 1000);

const enviarDados = () => {
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const telefoneInput = document.getElementById("telefone");
    const botaoEnviar = document.getElementById("botaoEnviar");

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const telefone = telefoneInput.value.trim();

    let valid = true;

    // Validação do nome
    if (!nome) {
        nomeInput.style.border = "1px solid red";
        valid = false;
    } else {
        nomeInput.style.border = "1px solid greenyellow";
    }

    // Validação do email com regex
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        emailInput.style.border = "1px solid red";
        valid = false;
    } else {
        emailInput.style.border = "1px solid greenyellow";
    }

    // Validação do telefone (11 dígitos)
    if (telefone.length !== 11 || isNaN(telefone)) {
        telefoneInput.style.border = "1px solid red";
        valid = false;
    } else {
        telefoneInput.style.border = "1px solid greenyellow";
    }

    // Se tudo for válido, enviar os dados
    if (valid) {
        botaoEnviar.disabled = true;
        botaoEnviar.textContent = "Enviando...";

        colocarNaPlanilha(nome, email, telefone)
            .then(() => {
                alert("Dados enviados com sucesso!");
                document.getElementById("contactModal").style.display = "none";

                nomeInput.value = "";
                emailInput.value = "";
                telefoneInput.value = "";

                nomeInput.style.border = "1px solid #ccc";
                emailInput.style.border = "1px solid #ccc";
                telefoneInput.style.border = "1px solid #ccc";

                botaoEnviar.disabled = false;
                botaoEnviar.textContent = "Enviar";
            })
            .catch(() => {
                alert("Erro ao enviar os dados. Tente novamente.");
                botaoEnviar.disabled = false;
                botaoEnviar.textContent = "Enviar";
            });
    }
};

const colocarNaPlanilha = (nome, email, telefone) => {
    return fetch("https://sheetdb.io/api/v1/c4pogog300irb", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data: {
                nome: nome,
                telefone: telefone,
                email: email
            }
        })
    }).then(res => {
        if (!res.ok) {
            throw new Error("Erro ao enviar para a planilha");
        }
        return res.json();
    });
};
