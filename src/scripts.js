class Auth {
  static login() {
    const email = Forms.emailField.val();
    const password = Forms.passwordField.val();

    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[email] && users[email].password === password) {
      localStorage.setItem("loggedInUser", JSON.stringify(users[email]));
      // Redirecionar para uma página autenticada
      window.location.href = "dashboard.html";
    } else {
      Forms.showError(Forms.loginForm, "Incorrect e-mail or password");
    }
  }

  static createAccount() {
    const name = Forms.nameField.val();
    const email = Forms.emailField.val();
    const password = Forms.passwordField.val();

    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[email]) {
      Forms.showError(Forms.createAccountForm, "This e-mail is already in use");
    } else {
      users[email] = { name, email, password };
      localStorage.setItem("users", JSON.stringify(users));
      this.login(email, password);
    }
  }

  static logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  }

  static isLoggedIn() {
    return localStorage.getItem("loggedInUser") !== null;
  }

  static getLoggedInUser() {
    return localStorage.getItem("loggedInUser");
  }
}

class Forms {
  static loginForm = $("#loginForm");
  static createAccountForm = $("#createAccountForm");
  static nameField = $("input[name='name']");
  static emailField = $("input[name='email']");
  static passwordField = $("input[name='password']");

  static showError(form, message) {
    form.find(".error-message").remove();
    const errorMessage = $("<div>").addClass("error-message").text(message);
    form.find("button[type='submit']").before(errorMessage);
  }

  static init() {
    if (this.loginForm.length) {
      this.loginForm.validate();
      this.loginForm.on("submit", function (e) {
        e.preventDefault();
        if (Forms.loginForm.valid()) {
          Auth.login();
        }
      });
    }

    if (this.createAccountForm.length) {
      this.createAccountForm.validate();

      this.createAccountForm.on("submit", function (e) {
        e.preventDefault();
        if (Forms.createAccountForm.valid()) {
          Auth.createAccount();
        }
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;

  const protectedPaths = ["/dashboard.html"];

  const isProtectedPath = protectedPaths.some((path) =>
    currentPath.endsWith(path)
  );

  if (isProtectedPath) {
    if (!Auth.getLoggedInUser()) {
      window.location.href = "index.html";
    }
  }
});

$("#logoutButton").on("click", function () {
  Auth.logout();
});
Forms.init();
