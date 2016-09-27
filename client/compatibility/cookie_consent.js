var options = {
  cookieTitle: "Uso de Cookies",
  cookieMessage: "Las cookies nos ayudan a proporcionar un mejor servicio."
     + " Al navegar por esta aplicación web aceptas que las usemos.",
  showLink: true,
  linkText: "Leer más",
  linkRouteName: "/cookies",
  acceptButtonText: "Aceptar",
  html: false,
  expirationInDays: 7
};

CookieConsent.init(options);
