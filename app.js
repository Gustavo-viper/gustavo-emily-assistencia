/* =========================================================
   GUSTAVO & EMILY - ASSISTÊNCIA TÉCNICA
   APP.JS - VERSÃO COMPLETA CORRIGIDA
========================================================= */

/* =========================================================
   1. CONFIGURAÇÃO
========================================================= */

const SUPABASE_URL =
  "https://xlvzsxnmyrwsicwvjfow.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_Dt8jtRRMhbfO8SJNGFQSpQ_EmAjRgpL";

const NUMERO_WHATSAPP =
  "5551989331736";

const CHAVE_PIX =
  "04416436041";

const NOME_EMPRESA =
  "Gustavo & Emily Assistência Técnica";


/* =========================================================
   2. SUPABASE
========================================================= */

let supabaseClient = null;

try {

  if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
  ) {

    supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );

  } else {

    console.error(
      "Biblioteca do Supabase não foi carregada."
    );

    // Feedback visual para o usuário
    mostrarMensagemAuth(
      "Erro de conexão: Biblioteca do Supabase não carregou. Verifique sua internet.",
      "error"
    );

  }

} catch (erro) {

  console.error(
    "Erro ao iniciar Supabase:",
    erro
  );

  // Feedback visual para o usuário
  mostrarMensagemAuth(
    "Erro de conexão: " + (erro.message || "Não foi possível conectar ao Supabase."),
    "error"
  );

}


/* =========================================================
   3. ESTADO DO SISTEMA
========================================================= */

let usuarioAtual = null;

let tipoUsuarioAtual = null;

let carrinhoLoja = [];


/* =========================================================
   4. CHAVES DO LOCALSTORAGE
========================================================= */

const STORAGE_KEYS = {

  clientes:
    "clientes",

  ordens:
    "ordens",

  orcamentos:
    "orcamentos",

  estoque:
    "estoque",

  aparelhos:
    "aparelhos",

  financeiro:
    "financeiro",

  produtosLoja:
    "produtosLoja",

  carrinho:
    "carrinhoLoja"

};


/* =========================================================
   5. ERROS GLOBAIS
========================================================= */

window.addEventListener(
  "error",
  function (event) {

    console.error(
      "ERRO GLOBAL:",
      event.error || event.message
    );

  }
);


window.addEventListener(
  "unhandledrejection",
  function (event) {

    console.error(
      "PROMISE REJEITADA:",
      event.reason
    );

  }
);


/* =========================================================
   6. FUNÇÕES BÁSICAS
========================================================= */

function obterDados(chave) {

  try {

    const valor =
      localStorage.getItem(chave);

    if (!valor) {
      return [];
    }

    const dados =
      JSON.parse(valor);

    return Array.isArray(dados)
      ? dados
      : [];

  } catch (erro) {

    console.error(
      "Erro ao ler:",
      chave,
      erro
    );

    return [];

  }

}


function salvarDados(
  chave,
  dados
) {

  try {

    localStorage.setItem(
      chave,
      JSON.stringify(dados)
    );

    return true;

  } catch (erro) {

    console.error(
      "Erro ao salvar:",
      chave,
      erro
    );

    mostrarToast(
      "Não foi possível salvar os dados.",
      "error"
    );

    return false;

  }

}


function gerarId(prefixo) {

  return (
    String(prefixo || "ID") +
    "-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()
  );

}


function formatarMoeda(valor) {

  const numero =
    Number(valor) || 0;

  return numero.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  );

}


function escapeHTML(valor) {

  return String(
    valor ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


function definirTexto(
  id,
  texto
) {

  const elemento =
    document.getElementById(id);

  if (elemento) {

    elemento.textContent =
      texto ?? "";

  }

}


function mostrarToast(
  mensagem,
  tipo
) {

  const toast =
    document.getElementById(
      "toast"
    );

  if (!toast) {

    console.log(
      mensagem
    );

    return;

  }

  toast.textContent =
    mensagem;

  toast.className =
    "toast";

  if (tipo) {

    toast.classList.add(
      tipo
    );

  }

  toast.hidden = false;

  clearTimeout(
    window.toastTimer
  );

  window.toastTimer =
    setTimeout(
      function () {

        toast.hidden =
          true;

      },
      3500
    );

}


/* =========================================================
   7. MODAL
========================================================= */

function abrirModal(
  conteudo
) {

  const overlay =
    document.getElementById(
      "modalOverlay"
    );

  const content =
    document.getElementById(
      "modalContent"
    );

  if (
    !overlay ||
    !content
  ) {
    return;
  }

  content.innerHTML =
    conteudo;

  overlay.hidden =
    false;

}


function fecharModal() {

  const overlay =
    document.getElementById(
      "modalOverlay"
    );

  if (overlay) {

    overlay.hidden =
      true;

  }

}


/* =========================================================
   8. LOGIN - TROCA DE TELAS
========================================================= */

function esconderCaixasLogin() {

  const caixas = [

    "adminLoginBox",

    "clientLoginBox",

    "clientRegisterBox"

  ];

  caixas.forEach(
    function (id) {

      const elemento =
        document.getElementById(
          id
        );

      if (elemento) {

        elemento.hidden =
          true;

      }

    }
  );

}


function configurarTrocaDeTelasLogin() {

  const adminBox =
    document.getElementById(
      "adminLoginBox"
    );

  const clientBox =
    document.getElementById(
      "clientLoginBox"
    );

  const registerBox =
    document.getElementById(
      "clientRegisterBox"
    );

  const showClient =
    document.getElementById(
      "showClientLoginButton"
    );

  const showRegister =
    document.getElementById(
      "showClientRegisterButton"
    );

  const showRegister2 =
    document.getElementById(
      "showClientRegisterButton2"
    );

  const backAdmin =
    document.getElementById(
      "backToAdminLoginButton"
    );

  const backClient =
    document.getElementById(
      "backToClientLoginButton"
    );


  if (showClient) {

    showClient.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        esconderCaixasLogin();

        if (clientBox) {

          clientBox.hidden =
            false;

        }

      }
    );

  }


  if (showRegister) {

    showRegister.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        esconderCaixasLogin();

        if (registerBox) {

          registerBox.hidden =
            false;

        }

      }
    );

  }


  if (showRegister2) {

    showRegister2.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        esconderCaixasLogin();

        if (registerBox) {

          registerBox.hidden =
            false;

        }

      }
    );

  }


  /*
     CORREÇÃO IMPORTANTE:

     Antes existia:

     if (backAdmin) {
       backAdmin.addEventListener(...)

     }

     mas a variável não estava declarada.

     Agora está corretamente declarada acima.
  */

  if (backAdmin) {

    backAdmin.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        esconderCaixasLogin();

        if (adminBox) {

          adminBox.hidden =
            false;

        }

      }
    );

  }


  if (backClient) {

    backClient.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        esconderCaixasLogin();

        if (clientBox) {

          clientBox.hidden =
            false;

        }

      }
    );

  }

}


/* =========================================================
   9. MENSAGEM DE AUTENTICAÇÃO
========================================================= */

function mostrarMensagemAuth(
  mensagem,
  tipo
) {

  const elemento =
    document.getElementById(
      "authMessage"
    );

  if (!elemento) {
    return;
  }

  elemento.textContent =
    mensagem;

  elemento.className =
    "auth-message";

  if (tipo) {

    elemento.classList.add(
      tipo
    );

  }

  elemento.hidden =
    false;

}


/* =========================================================
   10. CADASTRO DO CLIENTE
========================================================= */

function configurarCadastroCliente() {

  const form =
    document.getElementById(
      "clientRegisterForm"
    );

  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      if (!supabaseClient) {

        mostrarMensagemAuth(
          "Supabase não está disponível."
        );

        return;

      }


      const nome =
        document
          .getElementById(
            "clientName"
          )
          ?.value
          .trim();


      const telefone =
        document
          .getElementById(
            "clientPhone"
          )
          ?.value
          .trim();


      const email =
        document
          .getElementById(
            "clientRegisterEmail"
          )
          ?.value
          .trim()
          .toLowerCase();


      const senha =
        document
          .getElementById(
            "clientRegisterPassword"
          )
          ?.value;


      if (
        !nome ||
        !email ||
        !senha
      ) {

        mostrarMensagemAuth(
          "Preencha nome, e-mail e senha."
        );

        return;

      }


      if (
        senha.length < 6
      ) {

        mostrarMensagemAuth(
          "A senha precisa ter pelo menos 6 caracteres."
        );

        return;

      }


      try {

        const resultado =
          await supabaseClient.auth.signUp(
            {
              email:
                email,

              password:
                senha,

              options: {

                data: {

                  nome:
                    nome,

                  telefone:
                    telefone,

                  tipo:
                    "cliente"

                }

              }

            }
          );


        const data =
          resultado.data;

        const error =
          resultado.error;


        if (error) {
          throw error;
        }


        const clientes =
          obterDados(
            STORAGE_KEYS.clientes
          );


        const existente =
          clientes.find(
            function (cliente) {

              return (
                String(
                  cliente.email
                )
                  .toLowerCase() ===
                email
              );

            }
          );


        if (!existente) {

          clientes.push({

            id:
              gerarId("CLI"),

            nome:
              nome,

            telefone:
              telefone,

            email:
              email,

            dataCadastro:
              new Date().toISOString()

          });


          salvarDados(
            STORAGE_KEYS.clientes,
            clientes
          );

        }


        if (
          data &&
          data.session
        ) {

          usuarioAtual =
            data.user;

          tipoUsuarioAtual =
            "cliente";

          abrirSistema(
            data.user
          );

          return;

        }


        mostrarMensagemAuth(
          "Cadastro realizado. Verifique o e-mail caso a confirmação esteja ativada no Supabase.",
          "success"
        );


        esconderCaixasLogin();


        const clientBox =
          document.getElementById(
            "clientLoginBox"
          );


        if (clientBox) {

          clientBox.hidden =
            false;

        }

      } catch (erro) {

        console.error(
          "Erro no cadastro:",
          erro
        );

        mostrarMensagemAuth(
          erro.message ||
          "Não foi possível realizar o cadastro."
        );

      }

    }
  );

}


/* =========================================================
   11. LOGIN CLIENTE
========================================================= */

function configurarLoginCliente() {

  const form =
    document.getElementById(
      "clientLoginForm"
    );

  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      if (!supabaseClient) {

        mostrarMensagemAuth(
          "Supabase não está disponível."
        );

        return;

      }


      const email =
        document
          .getElementById(
            "clientLoginEmail"
          )
          ?.value
          .trim()
          .toLowerCase();


      const senha =
        document
          .getElementById(
            "clientLoginPassword"
          )
          ?.value;


      if (
        !email ||
        !senha
      ) {

        mostrarMensagemAuth(
          "Informe e-mail e senha."
        );

        return;

      }


      try {

        const {
          data,
          error
        } =
          await supabaseClient.auth.signInWithPassword(
            {
              email:
                email,

              password:
                senha

            }
          );


        if (error) {
          throw error;
        }


        usuarioAtual =
          data.user;

        tipoUsuarioAtual =
          "cliente";


        abrirSistema(
          data.user
        );

      } catch (erro) {

        console.error(
          "Erro login cliente:",
          erro
        );

        mostrarMensagemAuth(
          erro.message ||
          "E-mail ou senha inválidos."
        );

      }

    }
  );

}


/* =========================================================
   12. LOGIN ADMIN
========================================================= */

function configurarLoginAdmin() {

  const form =
    document.getElementById(
      "adminLoginForm"
    );

  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      if (!supabaseClient) {

        mostrarMensagemAuth(
          "Supabase não está disponível."
        );

        return;

      }


      const email =
        document
          .getElementById(
            "adminEmail"
          )
          ?.value
          .trim()
          .toLowerCase();


      const senha =
        document
          .getElementById(
            "adminPassword"
          )
          ?.value;


      if (
        !email ||
        !senha
      ) {

        mostrarMensagemAuth(
          "Informe e-mail e senha."
        );

        return;

      }


      try {

        const {
          data,
          error
        } =
          await supabaseClient.auth.signInWithPassword(
            {
              email:
                email,

              password:
                senha

            }
          );


        if (error) {
          throw error;
        }


        usuarioAtual =
          data.user;


        const metadata =
          data.user.user_metadata ||
          {};


        const tipo =
          metadata.tipo ||
          metadata.role ||
          "";


        if (
          tipo !== "admin"
        ) {

          await supabaseClient.auth.signOut();

          usuarioAtual =
            null;

          tipoUsuarioAtual =
            null;


          mostrarMensagemAuth(
            "Este usuário não possui acesso administrativo."
          );

          return;

        }


        tipoUsuarioAtual =
          "admin";


        abrirSistema(
          data.user
        );


      } catch (erro) {

        console.error(
          "Erro login admin:",
          erro
        );

        mostrarMensagemAuth(
          erro.message ||
          "Não foi possível entrar como administrador."
        );

      }

    }
  );

}


/* =========================================================
   13. SESSÃO SUPABASE
========================================================= */

async function verificarSessao() {

  if (!supabaseClient) {
    return;
  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth.getSession();


    if (error) {
      throw error;
    }


    const session =
      data?.session;


    if (
      !session ||
      !session.user
    ) {

      return;

    }


    usuarioAtual =
      session.user;


    const metadata =
      session.user.user_metadata ||
      {};


    const tipo =
      metadata.tipo ||
      metadata.role ||
      "cliente";


    tipoUsuarioAtual =
      tipo === "admin"
        ? "admin"
        : "cliente";


    abrirSistema(
      session.user
    );


  } catch (erro) {

    console.error(
      "Erro ao verificar sessão:",
      erro
    );

  }

}


function configurarAuthListener() {

  if (!supabaseClient) {
    return;
  }


  supabaseClient.auth.onAuthStateChange(
    function (
      event,
      session
    ) {

      console.log(
        "Supabase Auth:",
        event
      );


      if (
        event === "SIGNED_OUT"
      ) {

        usuarioAtual =
          null;

        tipoUsuarioAtual =
          null;

        mostrarLogin();

      }

    }
  );

}


/* =========================================================
   14. MOSTRAR LOGIN
========================================================= */

function mostrarLogin() {

  const auth =
    document.getElementById(
      "authScreen"
    );

  const admin =
    document.getElementById(
      "adminApp"
    );

  const client =
    document.getElementById(
      "clientApp"
    );


  if (auth) {

    auth.hidden =
      false;

    auth.style.display =
      "block";

  }


  if (admin) {

    admin.hidden =
      true;

    admin.style.display =
      "none";

  }


  if (client) {

    client.hidden =
      true;

    client.style.display =
      "none";

  }


  esconderCaixasLogin();


  const adminBox =
    document.getElementById(
      "adminLoginBox"
    );


  if (adminBox) {

    adminBox.hidden =
      false;

  }

}


/* =========================================================
   15. ABRIR SISTEMA
========================================================= */

function abrirSistema(
  usuario
) {

  const auth =
    document.getElementById(
      "authScreen"
    );

  const admin =
    document.getElementById(
      "adminApp"
    );

  const client =
    document.getElementById(
      "clientApp"
    );


  if (auth) {

    auth.hidden =
      true;

    auth.style.display =
      "none";

  }


  if (admin) {

    admin.hidden =
      true;

    admin.style.display =
      "none";

  }


  if (client) {

    client.hidden =
      true;

    client.style.display =
      "none";

  }


  /* ADMIN */

  if (
    tipoUsuarioAtual === "admin"
  ) {

    if (admin) {

      admin.hidden =
        false;

      admin.style.display =
        "block";

    }


    const nome =
      usuario
        ?.user_metadata
        ?.nome ||
      usuario?.email ||
      "Administrador";


    definirTexto(
      "adminDisplayName",
      nome
    );


    atualizarDashboard();

    carregarClientes();

    carregarOrdens();

    carregarOrcamentosAdmin();

    carregarEstoque();

    atualizarFinanceiro();


    mostrarPaginaAdmin(
      "dashboard"
    );


    return;

  }


  /* CLIENTE */

  if (
    tipoUsuarioAtual === "cliente"
  ) {

    if (client) {

      client.hidden =
        false;

      client.style.display =
        "block";

    }


    atualizarNomeCliente();

    carregarAparelhosCliente();

    atualizarResumoCliente();

    mostrarPaginaCliente(
      "client-home"
    );

  }

}


/* =========================================================
   16. LOGOUT
========================================================= */

async function fazerLogout() {

  try {

    if (supabaseClient) {

      await supabaseClient.auth.signOut();

    }

  } catch (erro) {

    console.error(
      "Erro no logout:",
      erro
    );

  }


  usuarioAtual =
    null;

  tipoUsuarioAtual =
    null;


  mostrarLogin();

}


function configurarLogout() {

  const adminLogout =
    document.getElementById(
      "adminLogoutButton"
    );


  const clientLogout =
    document.getElementById(
      "clientLogoutButton"
    );


  if (adminLogout) {

    adminLogout.addEventListener(
      "click",
      fazerLogout
    );

  }


  if (clientLogout) {

    clientLogout.addEventListener(
      "click",
      fazerLogout
    );

  }

}


/* =========================================================
   17. MENU ADMIN
========================================================= */

function configurarMenuAdmin() {

  const botoes =
    document.querySelectorAll(
      "[data-page]"
    );


  botoes.forEach(
    function (botao) {

      botao.addEventListener(
        "click",
        function (event) {

          event.preventDefault();


          const pagina =
            this.getAttribute(
              "data-page"
            );


          if (pagina) {

            mostrarPaginaAdmin(
              pagina
            );

          }

        }
      );

    }
  );


  /* BOTOES DE ACESSO RAPIDO DO DASHBOARD (data-go) */

  const botoesRapidos =
    document.querySelectorAll(
      "[data-go]"
    );

  botoesRapidos.forEach(
    function (botao) {

      botao.addEventListener(
        "click",
        function (event) {

          event.preventDefault();

          const pagina =
            this.getAttribute(
              "data-go"
            );

          if (pagina) {

            mostrarPaginaAdmin(
              pagina
            );

          }

        }
      );

    }
  );
}


function mostrarPaginaAdmin(
  pagina
) {

  if (
    tipoUsuarioAtual !== "admin"
  ) {

    return;

  }


  const paginas =
    document.querySelectorAll(
      ".page"
    );


  paginas.forEach(
    function (page) {

      page.hidden =
        true;

      page.classList.remove(
        "active"
      );

      page.style.display =
        "none";

    }
  );


  const paginaAtual =
    document.getElementById(
      pagina
    );


  if (!paginaAtual) {

    console.error(
      "Página admin não encontrada:",
      pagina
    );

    return;

  }


  paginaAtual.hidden =
    false;

  paginaAtual.style.display =
    "block";

  paginaAtual.classList.add(
    "active"
  );


  document
    .querySelectorAll(
      "[data-page]"
    )
    .forEach(
      function (item) {

        item.classList.toggle(
          "active",
          item.getAttribute(
            "data-page"
          ) === pagina
        );

      }
    );


  if (
    pagina === "dashboard"
  ) {

    atualizarDashboard();

  }


  if (
    pagina === "clientes"
  ) {

    carregarClientes();

  }


  if (
    pagina === "ordens"
  ) {

    carregarOrdens();

  }


  if (
    pagina === "orcamentos" ||
    pagina === "orcamentos-salvos"
  ) {

    carregarOrcamentosAdmin();

  }


  if (
    pagina === "estoque"
  ) {

    carregarEstoque();

  }


  if (
    pagina === "financeiro"
  ) {

    atualizarFinanceiro();

  }


  if (
    pagina === "configuracoes"
  ) {

    configurarPix();

  }

}


/* =========================================================
   18. MENU CLIENTE
========================================================= */

function configurarMenuCliente() {

  const botoes =
    document.querySelectorAll(
      ".client-menu-item"
    );


  if (!botoes.length) {

    console.warn(
      "Nenhum botão do menu cliente encontrado."
    );

    return;

  }


  botoes.forEach(
    function (botao) {

      botao.addEventListener(
        "click",
        function (event) {

          event.preventDefault();


          const pagina =
            this.getAttribute(
              "data-client-page"
            );


          if (!pagina) {

            console.warn(
              "Botão cliente sem data-client-page:",
              this
            );

            return;

          }


          mostrarPaginaCliente(
            pagina
          );

        }
      );

    }
  );

}


function mostrarPaginaCliente(
  pagina
) {

  if (
    tipoUsuarioAtual !== "cliente"
  ) {

    return;

  }


  const paginas =
    document.querySelectorAll(
      "[data-client-page-content]"
    );


  paginas.forEach(
    function (page) {

      page.hidden =
        true;

      page.style.display =
        "none";

      page.classList.remove(
        "active-client-page"
      );

    }
  );


  const paginaAtual =
    document.querySelector(
      `[data-client-page-content="${pagina}"]`
    );


  if (!paginaAtual) {

    console.error(
      "Página do cliente não encontrada:",
      pagina
    );

    return;

  }


  paginaAtual.hidden =
    false;

  paginaAtual.style.display =
    "block";

  paginaAtual.classList.add(
    "active-client-page"
  );


  document
    .querySelectorAll(
      ".client-menu-item"
    )
    .forEach(
      function (item) {

        item.classList.toggle(
          "active",
          item.getAttribute(
            "data-client-page"
          ) === pagina
        );

      }
    );


  if (
    pagina === "client-home"
  ) {

    atualizarResumoCliente();

  }


  if (
    pagina === "client-maintenance"
  ) {

    carregarAparelhosCliente();

  }


  if (
    pagina === "client-quotes"
  ) {

    carregarOrcamentosClienteTela();

  }


  if (
    pagina === "client-payments"
  ) {

    carregarPagamentosClienteTela();

  }


  if (
    pagina === "client-pix"
  ) {

    configurarPix();

  }


  if (
    pagina === "client-store"
  ) {

    renderizarCarrinho();

  }


  if (
    pagina === "client-contact"
  ) {

    configurarContatoCliente();

  }

}


/* =========================================================
   19. CLIENTE - NOME E RESUMO
========================================================= */

function atualizarNomeCliente() {

  const elemento =
    document.getElementById(
      "clientWelcomeName"
    );


  if (!elemento) {
    return;
  }


  const nome =
    usuarioAtual
      ?.user_metadata
      ?.nome ||
    usuarioAtual
      ?.user_metadata
      ?.name ||
    usuarioAtual?.email ||
    "Cliente";


  elemento.textContent =
    nome;

}


function atualizarResumoCliente() {

  if (!usuarioAtual) {
    return;
  }


  const email =
    String(
      usuarioAtual.email ||
      ""
    ).toLowerCase();


  const aparelhos =
    obterDados(
      STORAGE_KEYS.aparelhos
    ).filter(
      function (item) {

        return (
          String(
            item.email ||
            ""
          ).toLowerCase() ===
          email
        );

      }
    );


  const orcamentos =
    obterDados(
      STORAGE_KEYS.orcamentos
    ).filter(
      function (item) {

        return (
          String(
            item.email ||
            ""
          ).toLowerCase() ===
          email
        );

      }
    );


  const pendente =
    orcamentos.reduce(
      function (
        total,
        item
      ) {

        const totalOrcamento =
          Number(
            item.total ||
            0
          );


        const pago =
          Number(
            item.valorPago ||
            0
          );


        return (
          total +
          Math.max(
            totalOrcamento -
            pago,
            0
          )
        );

      },
      0
    );


  definirTexto(
    "clientTotalDevices",
    aparelhos.length
  );


  definirTexto(
    "clientTotalQuotes",
    orcamentos.length
  );


  definirTexto(
    "clientPendingPayments",
    formatarMoeda(
      pendente
    )
  );

}


/* =========================================================
   20. APARELHOS DO CLIENTE
========================================================= */

function configurarAparelhosCliente() {

  const addDeviceButton =
    document.getElementById("addDeviceButton");

  const deviceFormContainer =
    document.getElementById("deviceFormContainer");

  const cancelDeviceButton =
    document.getElementById("cancelDeviceButton");

  const deviceForm =
    document.getElementById("deviceForm");

  const modelSearch =
    document.getElementById("deviceModelSearch");

  /*
     ==========================================
     BOTÃO CADASTRAR APARELHO
     ==========================================
  */

  if (addDeviceButton) {

    addDeviceButton.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        console.log(
          "Cadastrar aparelho clicado"
        );

        if (deviceFormContainer) {

          deviceFormContainer.hidden = false;

          deviceFormContainer.style.display =
            "block";

          deviceFormContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }
    );

  }


  /*
     ==========================================
     BOTÃO CANCELAR
     ==========================================
  */

  if (cancelDeviceButton) {

    cancelDeviceButton.addEventListener(
      "click",
      function (event) {

        event.preventDefault();

        if (deviceFormContainer) {

          deviceFormContainer.hidden = true;

          deviceFormContainer.style.display =
            "none";

        }

        if (deviceForm) {

          deviceForm.reset();

        }

        const selectedModel =
          document.getElementById(
            "selectedDeviceModel"
          );

        if (selectedModel) {

          selectedModel.value = "";

        }

        const suggestions =
          document.getElementById(
            "deviceSuggestions"
          );

        if (suggestions) {

          suggestions.innerHTML = "";

          suggestions.hidden = true;

        }

      }
    );

  }


  /*
     ==========================================
     ENVIO DO FORMULÁRIO
     ==========================================
  */

  if (deviceForm) {

    deviceForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();

        cadastrarAparelhoCliente();

      }
    );

  }


  /*
     ==========================================
     PESQUISA DE MODELO
     ==========================================
  */

  if (modelSearch) {

    modelSearch.addEventListener(
      "input",
      function () {

        pesquisarModeloAparelho(
          this.value
        );

      }
    );

  }


  /*
     ==========================================
     CARREGAR APARELHOS
     ==========================================
  */

  carregarAparelhosCliente();

}


/* =========================================================
   CADASTRAR APARELHO
========================================================= */

function cadastrarAparelhoCliente() {

  if (!usuarioAtual) {

    mostrarToast(
      "Faça login para cadastrar um aparelho.",
      "error"
    );

    return;

  }


  const tipo =
    document
      .getElementById("deviceType")
      ?.value
      .trim();


  const modelo =
    document
      .getElementById("selectedDeviceModel")
      ?.value
      .trim() ||

    document
      .getElementById("deviceModelSearch")
      ?.value
      .trim();


  const identificador =
    document
      .getElementById("deviceIdentifier")
      ?.value
      .trim();


  const problema =
    document
      .getElementById("deviceProblem")
      ?.value
      .trim();


  /*
     ==========================================
     VALIDAÇÕES
     ==========================================
  */

  if (!tipo) {

    mostrarToast(
      "Selecione o tipo do aparelho.",
      "error"
    );

    return;

  }


  if (!modelo) {

    mostrarToast(
      "Informe o modelo do aparelho.",
      "error"
    );

    return;

  }


  if (!problema) {

    mostrarToast(
      "Informe o problema ou defeito.",
      "error"
    );

    return;

  }


  /*
     ==========================================
     BUSCAR APARELHOS
     ==========================================
  */

  const aparelhos =
    obterDados(
      STORAGE_KEYS.aparelhos
    );


  /*
     ==========================================
     NOVO APARELHO
     ==========================================
  */

  const novoAparelho = {

    id:
      gerarId("AP"),

    email:
      usuarioAtual.email,

    cliente: {

      nome:
        usuarioAtual
          ?.user_metadata
          ?.nome ||

        usuarioAtual
          ?.user_metadata
          ?.name ||

        usuarioAtual.email

    },

    aparelho:
      tipo,

    tipo:
      tipo,

    modelo:
      modelo,

    identificador:
      identificador,

    problema:
      problema,

    status:
      "Cadastrado",

    dataCadastro:
      new Date().toISOString()

  };


  aparelhos.push(
    novoAparelho
  );


  /*
     ==========================================
     SALVAR
     ==========================================
  */

  const salvo =
    salvarDados(
      STORAGE_KEYS.aparelhos,
      aparelhos
    );


  if (!salvo) {

    return;

  }


  /*
     ==========================================
     LIMPAR FORMULÁRIO
     ==========================================
  */

  const deviceForm =
    document.getElementById(
      "deviceForm"
    );


  const deviceFormContainer =
    document.getElementById(
      "deviceFormContainer"
    );


  if (deviceForm) {

    deviceForm.reset();

  }


  const selectedModel =
    document.getElementById(
      "selectedDeviceModel"
    );


  if (selectedModel) {

    selectedModel.value = "";

  }


  const suggestions =
    document.getElementById(
      "deviceSuggestions"
    );


  if (suggestions) {

    suggestions.innerHTML = "";

    suggestions.hidden = true;

  }


  if (deviceFormContainer) {

    deviceFormContainer.hidden = true;

    deviceFormContainer.style.display =
      "none";

  }


  /*
     ==========================================
     ATUALIZAR TELA
     ==========================================
  */

  carregarAparelhosCliente();

  atualizarResumoCliente();


  mostrarToast(
    "Aparelho cadastrado com sucesso!",
    "success"
  );

}


/* =========================================================
   PESQUISA DE MODELOS
========================================================= */

function pesquisarModeloAparelho(
  valor
) {

  const campo =
    document.getElementById(
      "deviceModelSearch"
    );


  const sugestoes =
    document.getElementById(
      "deviceSuggestions"
    );


  const selecionado =
    document.getElementById(
      "selectedDeviceModel"
    );


  if (
    !campo ||
    !sugestoes
  ) {

    return;

  }


  const modelos = [

    "iPhone 11",
    "iPhone 11 Pro",
    "iPhone 11 Pro Max",

    "iPhone 12",
    "iPhone 12 Mini",
    "iPhone 12 Pro",
    "iPhone 12 Pro Max",

    "iPhone 13",
    "iPhone 13 Mini",
    "iPhone 13 Pro",
    "iPhone 13 Pro Max",

    "iPhone 14",
    "iPhone 14 Plus",
    "iPhone 14 Pro",
    "iPhone 14 Pro Max",

    "iPhone 15",
    "iPhone 15 Plus",
    "iPhone 15 Pro",
    "iPhone 15 Pro Max",

    "iPhone 16",
    "iPhone 16 Plus",
    "iPhone 16 Pro",
    "iPhone 16 Pro Max",

    "Samsung Galaxy A12",
    "Samsung Galaxy A13",
    "Samsung Galaxy A14",
    "Samsung Galaxy A15",
    "Samsung Galaxy A24",
    "Samsung Galaxy A34",
    "Samsung Galaxy A54",

    "Samsung Galaxy S21",
    "Samsung Galaxy S22",
    "Samsung Galaxy S23",
    "Samsung Galaxy S24",

    "Motorola Moto G20",
    "Motorola Moto G30",
    "Motorola Moto G60",
    "Motorola Moto G84",

    "Xiaomi Redmi Note 10",
    "Xiaomi Redmi Note 11",
    "Xiaomi Redmi Note 12",
    "Xiaomi Redmi Note 13"

  ];


  const termo =
    String(
      valor || ""
    )
      .trim()
      .toLowerCase();


  sugestoes.innerHTML = "";


  if (!termo) {

    sugestoes.hidden = true;

    return;

  }


  const encontrados =
    modelos
      .filter(
        function (modelo) {

          return modelo
            .toLowerCase()
            .includes(
              termo
            );

        }
      )
      .slice(
        0,
        8
      );


  encontrados.forEach(
    function (modelo) {

      const botao =
        document.createElement(
          "button"
        );


      botao.type =
        "button";


      botao.textContent =
        modelo;


      botao.addEventListener(
        "click",
        function () {

          campo.value =
            modelo;


          if (selecionado) {

            selecionado.value =
              modelo;

          }


          sugestoes.innerHTML =
            "";

          sugestoes.hidden =
            true;

        }
      );


      sugestoes.appendChild(
        botao
      );

    }
  );


  sugestoes.hidden =
    encontrados.length === 0;

}


/* =========================================================
   CARREGAR APARELHOS
========================================================= */

function carregarAparelhosCliente() {

  const lista =
    document.getElementById(
      "clientDevicesList"
    );


  if (!lista) {

    return;

  }


  if (!usuarioAtual) {

    lista.innerHTML =
      "<p>Faça login para visualizar seus aparelhos.</p>";

    return;

  }


  const email =
    String(
      usuarioAtual.email ||
      ""
    )
      .toLowerCase();


  const aparelhos =
    obterDados(
      STORAGE_KEYS.aparelhos
    )
      .filter(
        function (item) {

          return (
            String(
              item.email ||
              ""
            )
              .toLowerCase() ===
            email
          );

        }
      );


  if (!aparelhos.length) {

    lista.innerHTML =
      "<p>Nenhum aparelho cadastrado.</p>";

    return;

  }


  lista.innerHTML =
    aparelhos
      .map(
        function (item) {

          return `

            <div class="client-device-card">

              <h3>
                ${escapeHTML(
                  item.tipo ||
                  item.aparelho ||
                  "Aparelho"
                )}
              </h3>

              <p>
                <strong>Modelo:</strong>
                ${escapeHTML(
                  item.modelo ||
                  ""
                )}
              </p>

              <p>
                <strong>Identificação:</strong>
                ${escapeHTML(
                  item.identificador ||
                  "Não informado"
                )}
              </p>

              <p>
                <strong>Problema:</strong>
                ${escapeHTML(
                  item.problema ||
                  ""
                )}
              </p>

              <p>
                <strong>Status:</strong>
                ${escapeHTML(
                  item.status ||
                  "Cadastrado"
                )}
              </p>

            </div>

          `;

        }
      )
      .join("");

}

/* =========================================================
   21. ORÇAMENTOS CLIENTE
========================================================= */

function carregarOrcamentosClienteTela() {

  const lista =
    document.getElementById(
      "clientQuotesList"
    );


  if (!lista) {
    return;
  }


  if (!usuarioAtual) {

    lista.innerHTML =
      "<p>Faça login para visualizar seus orçamentos.</p>";

    return;

  }


  const email =
    String(
      usuarioAtual.email ||
      ""
    ).toLowerCase();


  const orcamentos =
    obterDados(
      STORAGE_KEYS.orcamentos
    ).filter(
      function (item) {

        return (
          String(
            item.email ||
            ""
          ).toLowerCase() ===
          email
        );

      }
    );


  if (!orcamentos.length) {

    lista.innerHTML =
      "<p>Nenhum orçamento encontrado.</p>";

    return;

  }


  lista.innerHTML =
    orcamentos
      .map(
        function (item) {

          return `

            <div class="client-quote-card">

              <h3>
                Orçamento #${escapeHTML(
                  item.numero ||
                  item.id
                )}
              </h3>

              <p>
                <strong>Aparelho:</strong>
                ${escapeHTML(
                  item.aparelho ||
                  ""
                )}
              </p>

              <p>
                <strong>Serviço:</strong>
                ${escapeHTML(
                  item.servico ||
                  ""
                )}
              </p>

              <p>
                <strong>Total:</strong>
                ${formatarMoeda(
                  item.total
                )}
              </p>

              <p>
                <strong>Sinal 50%:</strong>
                ${formatarMoeda(
                  item.sinal
                )}
              </p>

              <p>
                <strong>Restante:</strong>
                ${formatarMoeda(
                  item.restante
                )}
              </p>

              <p>
                <strong>Status:</strong>
                ${escapeHTML(
                  item.status ||
                  "Pendente"
                )}
              </p>

            </div>

          `;

        }
      )
      .join("");

}


/* =========================================================
   22. PAGAMENTOS CLIENTE
========================================================= */

function carregarPagamentosClienteTela() {

  const lista =
    document.getElementById(
      "clientPaymentsList"
    );


  if (!lista) {
    return;
  }


  if (!usuarioAtual) {

    lista.innerHTML =
      "<p>Faça login para visualizar seus pagamentos.</p>";

    return;

  }


  const email =
    String(
      usuarioAtual.email ||
      ""
    ).toLowerCase();


  const orcamentos =
    obterDados(
      STORAGE_KEYS.orcamentos
    ).filter(
      function (item) {

        return (
          String(
            item.email ||
            ""
          ).toLowerCase() ===
          email
        );

      }
    );


  if (!orcamentos.length) {

    lista.innerHTML =
      "<p>Nenhum pagamento encontrado.</p>";

    return;

  }


  lista.innerHTML =
    orcamentos
      .map(
        function (item) {

          const total =
            Number(
              item.total ||
              0
            );


          const pago =
            Number(
              item.valorPago ||
              0
            );


          const restante =
            Math.max(
              total -
              pago,
              0
            );


          return `

            <div class="client-payment-card">

              <h3>
                Orçamento #${escapeHTML(
                  item.numero ||
                  item.id
                )}
              </h3>

              <p>
                Total:
                ${formatarMoeda(
                  total
                )}
              </p>

              <p>
                Pago:
                ${formatarMoeda(
                  pago
                )}
              </p>

              <p>
                A pagar:
                ${formatarMoeda(
                  restante
                )}
              </p>

              <p>
                Status:
                ${escapeHTML(
                  item.status ||
                  "Pendente"
                )}
              </p>

            </div>

          `;

        }
      )
      .join("");

}


/* =========================================================
   23. PIX
========================================================= */

function configurarPix() {

  const pix =
    document.getElementById(
      "pixKey"
    );


  if (pix) {

    pix.value =
      CHAVE_PIX;

  }

}


function copiarPix() {

  if (
    !navigator.clipboard
  ) {

    mostrarToast(
      "Copie a chave PIX manualmente.",
      "error"
    );

    return;

  }


  navigator.clipboard
    .writeText(
      CHAVE_PIX
    )
    .then(
      function () {

        mostrarToast(
          "Chave PIX copiada."
        );

      }
    )
    .catch(
      function () {

        mostrarToast(
          "Não foi possível copiar automaticamente.",
          "error"
        );

      }
    );

}


/* =========================================================
   24. CONTATO
========================================================= */

function configurarContatoCliente() {

  return true;

}


function abrirWhatsApp(
  mensagem
) {

  const texto =
    mensagem ||
    "Olá! Preciso de atendimento.";


  const url =
    "https://wa.me/" +
    NUMERO_WHATSAPP +
    "?text=" +
    encodeURIComponent(
      texto
    );


  window.open(
    url,
    "_blank"
  );

}


/* =========================================================
   25. TABELA DE PREÇOS
========================================================= */

function encontrarServicosNaTabela(
  aparelho
) {

  const fontes = [

    window.precos,

    window.PRECOS,

    window.tabelaPrecos,

    window.TabelaPrecos,

    window.precosAssistencia,

    window.PRECO_SERVICOS

  ];


  const fonte =
    fontes.find(
      function (valor) {

        return (
          Array.isArray(
            valor
          ) ||
          (
            valor &&
            typeof valor ===
              "object"
          )
        );

      }
    );


  if (!fonte) {

    return [];

  }


  let servicos = [];


  if (
    Array.isArray(
      fonte
    )
  ) {

    servicos =
      fonte
        .filter(
          function (item) {

            if (
              !item ||
              typeof item !==
                "object"
            ) {

              return false;

            }


            const valor =
              Number(
                item.valor ??
                item.preco ??
                item["preço"] ??
                item.price ??
                0
              );


            return (
              valor > 0
            );

          }
        )
        .map(
          function (item) {

            return {

              nome:
                item.nome ??
                item.servico ??
                item["serviço"] ??
                item.name ??
                "Serviço",

              valor:
                Number(
                  item.valor ??
                  item.preco ??
                  item["preço"] ??
                  item.price ??
                  0
                )

            };

          }
        );

  } else {

    servicos =
      Object.entries(
        fonte
      )
        .map(
          function ([
            nome,
            valor
          ]) {

            return {

              nome:
                nome,

              valor:
                Number(
                  valor
                ) || 0

            };

          }
        )
        .filter(
          function (item) {

            return (
              item.valor > 0
            );

          }
        );

  }


  /*
     Se a tabela tiver aparelhos separados,
     tentamos localizar o aparelho.
  */

  if (
    aparelho &&
    Array.isArray(
      fonte
    )
  ) {

    const filtrados =
      fonte.filter(
        function (item) {

          const texto =
            String(
              item.aparelho ||
              item.modelo ||
              ""
            ).toLowerCase();


          if (!texto) {
            return true;
          }


          return texto.includes(
            String(
              aparelho
            ).toLowerCase()
          );

        }
      );


    if (
      filtrados.length
    ) {

      const servicosFiltrados =
        filtrados
          .map(
            function (item) {

              const valor =
                Number(
                  item.valor ??
                  item.preco ??
                  item["preço"] ??
                  item.price ??
                  0
                );


              if (
                valor <= 0
              ) {

                return null;

              }


              return {

                nome:
                  item.nome ??
                  item.servico ??
                  item["serviço"] ??
                  item.name ??
                  "Serviço",

                valor:
                  valor

              };

            }
          )
          .filter(
            Boolean
          );


      if (
        servicosFiltrados.length
      ) {

        return servicosFiltrados;

      }

    }

  }


  return servicos;

}


/* =========================================================
   26. ORÇAMENTO
========================================================= */

function configurarOrcamento() {

  const form =
    document.getElementById(
      "quoteForm"
    );


  if (!form) {
    return;
  }


  const aparelho =
    document.getElementById(
      "quoteDevice"
    );


  if (aparelho) {

    aparelho.addEventListener(
      "input",
      atualizarServicosDoAparelho
    );


    aparelho.addEventListener(
      "change",
      atualizarServicosDoAparelho
    );

  }


  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      gerarOrcamento();

    }
  );


  const salvar =
    document.getElementById(
      "saveQuoteButton"
    );


  if (salvar) {

    salvar.addEventListener(
      "click",
      salvarOrcamentoAtual
    );

  }

}


function atualizarServicosDoAparelho() {

  const campo =
    document.getElementById(
      "quoteDevice"
    );


  const select =
    document.getElementById(
      "quoteService"
    );


  if (
    !campo ||
    !select
  ) {

    return;

  }


  const aparelho =
    campo.value.trim();


  const servicos =
    encontrarServicosNaTabela(
      aparelho
    );


  select.innerHTML =
    "";


  if (
    !servicos.length
  ) {

    const option =
      document.createElement(
        "option"
      );


    option.value =
      "";


    option.textContent =
      aparelho
        ? "Nenhum serviço cadastrado para este aparelho"
        : "Selecione o aparelho";


    select.appendChild(
      option
    );


    return;

  }


  const primeiro =
    document.createElement(
      "option"
    );


  primeiro.value =
    "";


  primeiro.textContent =
    "Selecione o serviço";


  select.appendChild(
    primeiro
  );


  servicos.forEach(
    function (item) {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        item.nome;


      option.dataset.valor =
        item.valor;


      option.textContent =
        item.nome +
        " - " +
        formatarMoeda(
          item.valor
        );


      select.appendChild(
        option
      );

    }
  );

}


function gerarOrcamento() {

  const aparelho =
    document.getElementById(
      "quoteDevice"
    )
      ?.value
      .trim();


  const servico =
    document.getElementById(
      "quoteService"
    )
      ?.value;


  const select =
    document.getElementById(
      "quoteService"
    );


  const option =
    select
      ?.selectedOptions
      ?.[0];


  const valor =
    Number(
      option
        ?.dataset
        ?.valor ||
      0
    );


  if (!aparelho) {

    mostrarToast(
      "Informe o aparelho.",
      "error"
    );

    return;

  }


  if (!servico) {

    mostrarToast(
      "Selecione o serviço.",
      "error"
    );

    return;

  }


  if (
    !Number.isFinite(
      valor
    ) ||
    valor <= 0
  ) {

    mostrarToast(
      "Este serviço não possui preço cadastrado na tabela.",
      "error"
    );

    return;

  }


  const sinal =
    valor / 2;


  const restante =
    valor / 2;


  definirTexto(
    "resultDevice",
    aparelho
  );


  definirTexto(
    "resultService",
    servico
  );


  definirTexto(
    "resultTotal",
    formatarMoeda(
      valor
    )
  );


  definirTexto(
    "resultDeposit",
    formatarMoeda(
      sinal
    )
  );


  definirTexto(
    "resultRemaining",
    formatarMoeda(
      restante
    )
  );


  const resultado =
    document.getElementById(
      "quoteResult"
    );


  if (resultado) {

    resultado.hidden =
      false;

  }

}


/* =========================================================
   27. SALVAR ORÇAMENTO
========================================================= */

function salvarOrcamentoAtual() {

  if (
    tipoUsuarioAtual !== "admin"
  ) {

    mostrarToast(
      "Somente o administrador pode salvar orçamentos.",
      "error"
    );

    return;

  }


  const aparelho =
    document.getElementById(
      "quoteDevice"
    )
      ?.value
      .trim();


  const servico =
    document.getElementById(
      "quoteService"
    )
      ?.value;


  const option =
    document
      .getElementById(
        "quoteService"
      )
      ?.selectedOptions
      ?.[0];


  const total =
    Number(
      option
        ?.dataset
        ?.valor ||
      0
    );


  if (
    !aparelho ||
    !servico ||
    total <= 0
  ) {

    mostrarToast(
      "Gere um orçamento válido antes de salvar.",
      "error"
    );

    return;

  }


  const clienteEmail =
    prompt(
      "Digite o e-mail do cliente:"
    );


  if (
    !clienteEmail
  ) {

    return;

  }


  const orcamentos =
    obterDados(
      STORAGE_KEYS.orcamentos
    );


  const sinal =
    total / 2;


  const novoOrcamento = {

    id:
      gerarId("ORC"),

    numero:
      Date.now()
        .toString()
        .slice(-6),

    email:
      clienteEmail
        .trim()
        .toLowerCase(),

    aparelho:
      aparelho,

    servico:
      servico,

    total:
      total,

    sinal:
      sinal,

    restante:
      sinal,

    valorPago:
      0,

    status:
      "Aguardando sinal",

    data:
      new Date().toISOString()

  };


  orcamentos.push(
    novoOrcamento
  );


  if (
    salvarDados(
      STORAGE_KEYS.orcamentos,
      orcamentos
    )
  ) {

    mostrarToast(
      "Orçamento salvo com sucesso."
    );


    carregarOrcamentosAdmin();

    atualizarDashboard();

    atualizarFinanceiro();

  }

}


/* =========================================================
   28. ORÇAMENTOS ADMIN
========================================================= */

function carregarOrcamentosAdmin() {

  const tabela =
    document.getElementById(
      "savedQuotesTable"
    );


  if (!tabela) {
    return;
  }


  const orcamentos =
    obterDados(
      STORAGE_KEYS.orcamentos
    );


  if (!orcamentos.length) {

    tabela.innerHTML =
      "<p>Nenhum orçamento salvo.</p>";

    return;

  }


  tabela.innerHTML = `

    <div class="table-responsive">

      <table>

        <thead>

          <tr>

            <th>Número</th>

            <th>Cliente</th>

            <th>Aparelho</th>

            <th>Serviço</th>

            <th>Total</th>

            <th>Sinal</th>

            <th>Restante</th>

            <th>Status</th>

            <th>Ações</th>

          </tr>

        </thead>

        <tbody>

          ${
            orcamentos
              .map(
                function (item) {

                  return `

                    <tr>

                      <td>
                        #${escapeHTML(
                          item.numero ||
                          item.id
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          item.email ||
                          ""
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          item.aparelho ||
                          ""
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          item.servico ||
                          ""
                        )}
                      </td>

                      <td>
                        ${formatarMoeda(
                          item.total
                        )}
                      </td>

                      <td>
                        ${formatarMoeda(
                          item.sinal
                        )}
                      </td>

                      <td>
                        ${formatarMoeda(
                          item.restante
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          item.status ||
                          "Pendente"
                        )}
                      </td>

                      <td>

                        <button
                          type="button"
                          onclick="registrarSinal('${item.id}')"
                        >
                          Registrar sinal
                        </button>

                        <button
                          type="button"
                          onclick="excluirOrcamento('${item.id}')"
                        >
                          Excluir
                        </button>

                      </td>

                    </tr>

                  `;

                }
              )
              .join("")
          }

        </tbody>

      </table>

    </div>

  `;

}


/* =========================================================
   29. REGISTRAR SINAL
========================================================= */

function registrarSinal(
  id
) {

  const orcamentos =
    obterDados(
      STORAGE_KEYS.orcamentos
    );


  const item =
    orcamentos.find(
      function (orcamento) {

        return (
          orcamento.id ===
          id
        );

      }
    );


  if (!item) {

    mostrarToast(
      "Orçamento não encontrado.",
      "error"
    );

    return;

  }


  if (
    Number(
      item.valorPago ||
      0
    ) >=
    Number(
      item.sinal ||
      0
    )
  ) {

    mostrarToast(
      "O sinal já foi registrado."
    );

    return;

  }


  item.valorPago =
    Number(
      item.valorPago ||
      0
    ) +
    Number(
      item.sinal ||
      0
    );


  item.restante =
    Math.max(
      Number(
        item.total ||
        0
      ) -
      Number(
        item.valorPago ||
        0
      ),
      0
    );


  item.status =
    item.restante <= 0
      ? "Pago"
      : "Sinal recebido";


  salvarDados(
    STORAGE_KEYS.orcamentos,
    orcamentos
  );


  carregarOrcamentosAdmin();

  atualizarFinanceiro();

  atualizarDashboard();

  mostrarToast(
    "Sinal registrado com sucesso."
  );

}


/* =========================================================
   30. EXCLUIR ORÇAMENTO
========================================================= */

function excluirOrcamento(
  id
) {

  if (
    !window.confirm(
      "Deseja realmente excluir este orçamento?"
    )
  ) {

    return;

  }


  const dados =
    obterDados(
      STORAGE_KEYS.orcamentos
    ).filter(
      function (item) {

        return (
          item.id !==
          id
        );

      }
    );


  salvarDados(
    STORAGE_KEYS.orcamentos,
    dados
  );


  carregarOrcamentosAdmin();

  atualizarDashboard();

  atualizarFinanceiro();


  mostrarToast(
    "Orçamento excluído."
  );

}


/* =========================================================
   31. CLIENTES ADMIN
========================================================= */

function carregarClientes() {

  const tabela =
    document.getElementById(
      "clientsTable"
    );


  if (!tabela) {
    return;
  }


  const clientes =
    obterDados(
      STORAGE_KEYS.clientes
    );


  renderizarClientes(
    clientes
  );

}


function renderizarClientes(
  clientes
) {

  const tabela =
    document.getElementById(
      "clientsTable"
    );


  if (!tabela) {
    return;
  }


  if (!clientes.length) {

    tabela.innerHTML =
      "<p>Nenhum cliente cadastrado.</p>";

    return;

  }


  tabela.innerHTML = `

    <div class="table-responsive">

      <table>

        <thead>

          <tr>

            <th>Nome</th>

            <th>Telefone</th>

            <th>E-mail</th>

            <th>Ações</th>

          </tr>

        </thead>

        <tbody>

          ${
            clientes
              .map(
                function (item) {

                  return `

                    <tr>

                      <td>
                        ${escapeHTML(
                          item.nome ||
                          ""
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          item.telefone ||
                          ""
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          item.email ||
                          ""
                        )}
                      </td>

                      <td>

                        <button
                          type="button"
                          onclick="excluirCliente('${item.id}')"
                        >
                          Excluir
                        </button>

                      </td>

                    </tr>

                  `;

                }
              )
              .join("")
          }

        </tbody>

      </table>

    </div>

  `;

}


function configurarAdicionarCliente() {

  const botao =
    document.getElementById(
      "addClientBtn"
    );


  if (!botao) {
    return;
  }


  botao.addEventListener(
    "click",
    function () {

      const nome =
        prompt(
          "Nome do cliente:"
        );


      if (!nome) {
        return;
      }


      const telefone =
        prompt(
          "Telefone:"
        ) ||
        "";


      const email =
        prompt(
          "E-mail:"
        ) ||
        "";


      const clientes =
        obterDados(
          STORAGE_KEYS.clientes
        );


      clientes.push({

        id:
          gerarId("CLI"),

        nome:
          nome.trim(),

        telefone:
          telefone.trim(),

        email:
          email
            .trim()
            .toLowerCase(),

        dataCadastro:
          new Date().toISOString()

      });


      salvarDados(
        STORAGE_KEYS.clientes,
        clientes
      );


      carregarClientes();

      atualizarDashboard();


      mostrarToast(
        "Cliente adicionado."
      );

    }
  );

}


function excluirCliente(
  id
) {

  if (
    !window.confirm(
      "Deseja excluir este cliente?"
    )
  ) {

    return;

  }


  const clientes =
    obterDados(
      STORAGE_KEYS.clientes
    ).filter(
      function (item) {

        return (
          item.id !==
          id
        );

      }
    );


  salvarDados(
    STORAGE_KEYS.clientes,
    clientes
  );


  carregarClientes();

  atualizarDashboard();


  mostrarToast(
    "Cliente excluído."
  );

}


/* =========================================================
   32. ORDENS DE SERVIÇO
========================================================= */

function carregarOrdens() {

  const tabela =
    document.getElementById(
      "ordersTable"
    );


  if (!tabela) {
    return;
  }


  let ordens =
    obterDados(
      STORAGE_KEYS.ordens
    );


  const filtro =
    document.getElementById(
      "orderFilter"
    )
      ?.value;


  if (filtro) {

    ordens =
      ordens.filter(
        function (item) {

          return (
            item.status ===
            filtro
          );

        }
      );

  }


  if (!ordens.length) {

    tabela.innerHTML =
      "<p>Nenhuma ordem encontrada.</p>";

    return;

  }


  tabela.innerHTML = `

    <div class="table-responsive">

      <table>

        <thead>

          <tr>

            <th>OS</th>

            <th>Cliente</th>

            <th>Aparelho</th>

            <th>Problema</th>

            <th>Status</th>

            <th>Ações</th>

          </tr>

        </thead>

        <tbody>

          ${
            ordens
              .map(
                function (item) {

                  return `

                    <tr>

                      <td>
                        #${escapeHTML(
                          item.numero ||
                          item.id
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          item.email ||
                          item.cliente ||
                          ""
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          item.aparelho ||
                          ""
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          item.problema ||
                          ""
                        )}
                      </td>

                      <td>
                        ${escapeHTML(
                          item.status ||
                          "Aberta"
                        )}
                      </td>

                      <td>

                        <button
                          type="button"
                          onclick="alterarStatusOrdem('${item.id}')"
                        >
                          Alterar status
                        </button>

                        <button
                          type="button"
                          onclick="excluirOrdem('${item.id}')"
                        >
                          Excluir
                        </button>

                      </td>

                    </tr>

                  `;

                }
              )
              .join("")
          }

        </tbody>

      </table>

    </div>

  `;

}


function configurarFiltroOrdens() {

  const filtro =
    document.getElementById(
      "orderFilter"
    );


  if (filtro) {

    filtro.addEventListener(
      "change",
      carregarOrdens
    );

  }

}


function configurarNovaOrdem() {

  const botoes = [

    document.getElementById(
      "newOrderBtn"
    ),

    document.getElementById(
      "addOrderBtn"
    )

  ];


  botoes.forEach(
    function (botao) {

      if (!botao) {
        return;
      }


      botao.addEventListener(
        "click",
        function () {

          const email =
            prompt(
              "E-mail do cliente:"
            );


          if (!email) {
            return;
          }


          const aparelho =
            prompt(
              "Aparelho:"
            );


          if (!aparelho) {
            return;
          }


          const problema =
            prompt(
              "Problema relatado:"
            ) ||
            "";


          const ordens =
            obterDados(
              STORAGE_KEYS.ordens
            );


          ordens.push({

            id:
              gerarId("OS"),

            numero:
              Date.now()
                .toString()
                .slice(-6),

            email:
              email
                .trim()
                .toLowerCase(),

            aparelho:
              aparelho.trim(),

            problema:
              problema.trim(),

            status:
              "Aguardando avaliação",

            data:
              new Date().toISOString()

          });


          salvarDados(
            STORAGE_KEYS.ordens,
            ordens
          );


          carregarOrdens();

          atualizarDashboard();


          mostrarToast(
            "Ordem criada."
          );

        }
      );

    }
  );

}


function alterarStatusOrdem(
  id
) {

  const novoStatus =
    prompt(
      "Digite o novo status:",
      "Em manutenção"
    );


  if (!novoStatus) {
    return;
  }


  const ordens =
    obterDados(
      STORAGE_KEYS.ordens
    );


  const item =
    ordens.find(
      function (ordem) {

        return (
          ordem.id ===
          id
        );

      }
    );


  if (!item) {
    return;
  }


  item.status =
    novoStatus.trim();


  salvarDados(
    STORAGE_KEYS.ordens,
    ordens
  );


  carregarOrdens();

  atualizarDashboard();


  mostrarToast(
    "Status atualizado."
  );

}


function excluirOrdem(
  id
) {

  if (
    !window.confirm(
      "Deseja excluir esta ordem?"
    )
  ) {

    return;

  }


  const ordens =
    obterDados(
      STORAGE_KEYS.ordens
    ).filter(
      function (item) {

        return (
          item.id !==
          id
        );

      }
    );


  salvarDados(
    STORAGE_KEYS.ordens,
    ordens
  );


  carregarOrdens();

  atualizarDashboard();


  mostrarToast(
    "Ordem excluída."
  );

}


/* =========================================================
   33. ESTOQUE
========================================================= */

function carregarEstoque() {

  const tabela =
    document.getElementById(
      "stockTable"
    );


  if (!tabela) {
    return;
  }


  const estoque =
    obterDados(
      STORAGE_KEYS.estoque
    );


  if (!estoque.length) {

    tabela.innerHTML =
      "<p>Nenhum item no estoque.</p>";

    return;

  }


  tabela.innerHTML = `

    <div class="table-responsive">

      <table>

        <thead>

          <tr>

            <th>Produto</th>

            <th>Quantidade</th>

            <th>Preço</th>

            <th>Ações</th>

          </tr>

        </thead>

        <tbody>

          ${
            estoque
              .map(
                function (item) {

                  return `

                    <tr>

                      <td>
                        ${escapeHTML(
                          item.nome ||
                          ""
                        )}
                      </td>

                      <td>
                        ${Number(
                          item.quantidade ||
                          0
                        )}
                      </td>

                      <td>
                        ${formatarMoeda(
                          item.valor ||
                          0
                        )}
                      </td>

                      <td>

                        <button
                          type="button"
                          onclick="excluirEstoque('${item.id}')"
                        >
                          Excluir
                        </button>

                      </td>

                    </tr>

                  `;

                }
              )
              .join("")
          }

        </tbody>

      </table>

    </div>

  `;

}


function configurarAdicionarEstoque() {

  const botao =
    document.getElementById(
      "addStockBtn"
    );


  if (!botao) {
    return;
  }


  botao.addEventListener(
    "click",
    function () {

      const nome =
        prompt(
          "Nome da peça/produto:"
        );


      if (!nome) {
        return;
      }


      const quantidade =
        Number(
          prompt(
            "Quantidade:",
            "1"
          )
        );


      const valor =
        Number(
          prompt(
            "Preço unitário:",
            "0"
          )
        );


      const estoque =
        obterDados(
          STORAGE_KEYS.estoque
        );


      estoque.push({

        id:
          gerarId("EST"),

        nome:
          nome.trim(),

        quantidade:
          Number.isFinite(
            quantidade
          )
            ? quantidade
            : 0,

        valor:
          Number.isFinite(
            valor
          )
            ? valor
            : 0

      });


      salvarDados(
        STORAGE_KEYS.estoque,
        estoque
      );


      carregarEstoque();

      atualizarDashboard();


      mostrarToast(
        "Item adicionado ao estoque."
      );

    }
  );

}


function excluirEstoque(
  id
) {

  if (
    !window.confirm(
      "Deseja excluir este item do estoque?"
    )
  ) {

    return;

  }


  const estoque =
    obterDados(
      STORAGE_KEYS.estoque
    ).filter(
      function (item) {

        return (
          item.id !==
          id
        );

      }
    );


  salvarDados(
    STORAGE_KEYS.estoque,
    estoque
  );


  carregarEstoque();

  atualizarDashboard();


  mostrarToast(
    "Item excluído."
  );

}


/* =========================================================
   34. FINANCEIRO
========================================================= */

function atualizarFinanceiro() {
  const ordens = obterDados(STORAGE_KEYS.ordens) || [];
  const orcamentos = obterDados(STORAGE_KEYS.orcamentos) || [];
  const financeiro = obterDados(STORAGE_KEYS.financeiro) || [];

  let totalRecebido = 0;
  let saldoAReceber = 0;

  financeiro.forEach(item => {
    const valor = Number(item.valor || item.amount || 0);

    if (
      item.status === "pago" ||
      item.status === "recebido" ||
      item.pago === true
    ) {
      totalRecebido += valor;
    }
  });

  orcamentos.forEach(orcamento => {
    const total = Number(
      orcamento.valorTotal ||
      orcamento.total ||
      orcamento.valor ||
      0
    );

    const sinal = Number(
      orcamento.sinal ||
      orcamento.valorSinal ||
      total / 2
    );

    if (
      orcamento.statusSinal !== "pago" &&
      orcamento.sinalPago !== true
    ) {
      saldoAReceber += sinal;
    }

    if (
      orcamento.statusSinal === "pago" &&
      orcamento.restantePago !== true
    ) {
      saldoAReceber += Math.max(0, total - sinal);
    }
  });

  ordens.forEach(ordem => {
    const valor = Number(
      ordem.valorTotal ||
      ordem.valor ||
      0
    );

    if (
      ordem.statusPagamento !== "pago" &&
      ordem.pago !== true
    ) {
      saldoAReceber += valor;
    }
  });

  definirTexto(
    "totalReceived",
    formatarMoeda(totalRecebido)
  );

  definirTexto(
    "financeReceivable",
    formatarMoeda(saldoAReceber)
  );

  definirTexto(
    "totalReceivable",
    formatarMoeda(saldoAReceber)
  );
}


/* =========================================================
   35. DASHBOARD
========================================================= */

function atualizarDashboard() {

  const clientes =
    obterDados(
      STORAGE_KEYS.clientes
    );


  const ordens =
    obterDados(
      STORAGE_KEYS.ordens
    );


  const estoque =
    obterDados(
      STORAGE_KEYS.estoque
    );


  const orcamentos =
    obterDados(
      STORAGE_KEYS.orcamentos
    );


  const aReceber =
    orcamentos.reduce(
      function (
        total,
        item
      ) {

        return (
          total +
          Math.max(
            Number(
              item.total ||
              0
            ) -
            Number(
              item.valorPago ||
              0
            ),
            0
          )
        );

      },
      0
    );


  const quantidadeEstoque =
    estoque.reduce(
      function (
        total,
        item
      ) {

        return (
          total +
          Number(
            item.quantidade ||
            0
          )
        );

      },
      0
    );


  definirTexto(
    "totalClients",
    clientes.length
  );


  definirTexto(
    "totalOrders",
    ordens.length
  );


  definirTexto(
    "totalReceivable",
    formatarMoeda(
      aReceber
    )
  );


  definirTexto(
    "totalStock",
    quantidadeEstoque
  );


  const recentes =
    document.getElementById(
      "recentOrders"
    );


  if (!recentes) {
    return;
  }


  const ultimas =
    ordens
      .slice()
      .reverse()
      .slice(
        0,
        5
      );


  if (!ultimas.length) {

    recentes.innerHTML =
      "<p>Nenhuma ordem cadastrada.</p>";

    return;

  }


  recentes.innerHTML =
    ultimas
      .map(
        function (item) {

          return `

            <div class="recent-order">

              <strong>
                OS #${escapeHTML(
                  item.numero ||
                  item.id
                )}
              </strong>

              <span>
                ${escapeHTML(
                  item.aparelho ||
                  ""
                )}
              </span>

              <small>
                ${escapeHTML(
                  item.status ||
                  "Aberta"
                )}
              </small>

            </div>

          `;

        }
      )
      .join("");

}


/* =========================================================
   36. LOJA E CARRINHO DO CLIENTE
========================================================= */

function obterProdutosLoja() {
  const produtosSalvos = obterDados(STORAGE_KEYS.produtosLoja, []);

  if (produtosSalvos.length > 0) {
    return produtosSalvos;
  }

  return [
    {
      id: "capinha-celular",
      nome: "Capinha para celular",
      valor: 25,
      imagem: "📱"
    },
    {
      id: "pelicula-vidro",
      nome: "Película de vidro",
      valor: 15,
      imagem: "🛡️"
    },
    {
      id: "mouse-usb",
      nome: "Mouse USB",
      valor: 35,
      imagem: "🖱️"
    },
    {
      id: "teclado-usb",
      nome: "Teclado USB",
      valor: 55,
      imagem: "⌨️"
    },
    {
      id: "cabo-usb",
      nome: "Cabo USB",
      valor: 20,
      imagem: "🔌"
    },
    {
      id: "fone-ouvido",
      nome: "Fone de ouvido",
      valor: 30,
      imagem: "🎧"
    }
  ];
}


/* =========================================================
   CONFIGURAR LOJA
========================================================= */

function configurarLoja() {

  const form = document.getElementById(
    "formPedidoLoja"
  );

  if (form && !form.dataset.configurado) {

    form.addEventListener(
      "submit",
      enviarPedidoLoja
    );

    form.dataset.configurado = "true";

  }

  configurarBotoesAdicionarCarrinho();

  carregarCarrinho();

  renderizarCarrinho();

}


/* =========================================================
   BOTÕES ADICIONAR AO CARRINHO
========================================================= */

function configurarBotoesAdicionarCarrinho() {

  document.addEventListener(
    "click",
    function (event) {

      const botao = event.target.closest(
        "[data-product-id], [data-produto-id], .add-to-cart, .btn-add-cart, .adicionar-carrinho"
      );

      if (!botao) {
        return;
      }

      const id =
        botao.dataset.productId ||
        botao.dataset.produtoId ||
        botao.dataset.id;

      if (!id) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      adicionarProdutoLoja(id);

    }
  );

}


/* =========================================================
   CARREGAR CARRINHO
========================================================= */

function carregarCarrinho() {

  try {

    const dados = localStorage.getItem(
      STORAGE_KEYS.carrinho
    );

    if (!dados) {
      carrinhoLoja = [];
      return;
    }

    const convertido = JSON.parse(dados);

    carrinhoLoja = Array.isArray(convertido)
      ? convertido
      : [];

  } catch (erro) {

    console.error(
      "Erro ao carregar carrinho:",
      erro
    );

    carrinhoLoja = [];

  }

}


/* =========================================================
   SALVAR CARRINHO
========================================================= */

function salvarCarrinho() {

  try {

    localStorage.setItem(
      STORAGE_KEYS.carrinho,
      JSON.stringify(carrinhoLoja)
    );

  } catch (erro) {

    console.error(
      "Erro ao salvar carrinho:",
      erro
    );

  }

}


/* =========================================================
   CALCULAR TOTAL DO CARRINHO
========================================================= */

function calcularTotalCarrinho() {

  return carrinhoLoja.reduce(
    function (total, item) {

      const valor =
        Number(item.valor) || 0;

      const quantidade =
        Number(item.quantidade) || 0;

      return total + valor * quantidade;

    },
    0
  );

}


/* =========================================================
   ATUALIZAR CONTADOR DO CARRINHO
========================================================= */

function atualizarContadorCarrinho() {

  const quantidadeTotal =
    carrinhoLoja.reduce(
      function (total, item) {

        return total + (
          Number(item.quantidade) || 0
        );

      },
      0
    );

  const contadores = document.querySelectorAll(
    "#contadorCarrinho, #cartCount, .cart-count, [data-cart-count]"
  );

  contadores.forEach(
    function (contador) {

      contador.textContent =
        quantidadeTotal;

      contador.hidden =
        quantidadeTotal <= 0;

    }
  );

}


/* =========================================================
   ADICIONAR PRODUTO
========================================================= */

function adicionarProdutoLoja(id) {

  const produto = obterProdutosLoja().find(
    function (item) {

      return String(item.id) === String(id);

    }
  );

  if (!produto) {

    mostrarToast(
      "Produto não encontrado.",
      "error"
    );

    return;

  }

  const existente = carrinhoLoja.find(
    function (item) {

      return String(item.id) === String(id);

    }
  );

  if (existente) {

    existente.quantidade =
      Number(existente.quantidade || 0) + 1;

  } else {

    carrinhoLoja.push({

      id: produto.id,

      nome: produto.nome,

      valor: Number(produto.valor) || 0,

      imagem: produto.imagem || "",

      quantidade: 1

    });

  }

  salvarCarrinho();

  renderizarCarrinho();

  mostrarToast(
    produto.nome + " adicionado ao carrinho.",
    "success"
  );

}


/* =========================================================
   AUMENTAR QUANTIDADE
========================================================= */

function aumentarProdutoLoja(id) {

  const item = carrinhoLoja.find(
    function (produto) {

      return String(produto.id) === String(id);

    }
  );

  if (!item) {
    return;
  }

  item.quantidade =
    Number(item.quantidade || 0) + 1;

  salvarCarrinho();

  renderizarCarrinho();

}


/* =========================================================
   DIMINUIR QUANTIDADE
========================================================= */

function diminuirProdutoLoja(id) {

  const item = carrinhoLoja.find(
    function (produto) {

      return String(produto.id) === String(id);

    }
  );

  if (!item) {
    return;
  }

  item.quantidade =
    Number(item.quantidade || 0) - 1;

  if (item.quantidade <= 0) {

    removerProdutoLoja(id);
    return;

  }

  salvarCarrinho();

  renderizarCarrinho();

}


/* =========================================================
   REMOVER PRODUTO
========================================================= */

function removerProdutoLoja(id) {

  carrinhoLoja = carrinhoLoja.filter(
    function (item) {

      return String(item.id) !== String(id);

    }
  );

  salvarCarrinho();

  renderizarCarrinho();

  mostrarToast(
    "Produto removido do carrinho.",
    "success"
  );

}


/* =========================================================
   ESVAZIAR CARRINHO
========================================================= */

function esvaziarCarrinho() {

  if (!carrinhoLoja.length) {
    return;
  }

  const confirmar = window.confirm(
    "Deseja remover todos os produtos do carrinho?"
  );

  if (!confirmar) {
    return;
  }

  carrinhoLoja = [];

  salvarCarrinho();

  renderizarCarrinho();

  mostrarToast(
    "Carrinho esvaziado.",
    "success"
  );

}


/* =========================================================
   CARRINHO DE LOJA - RESUMO DO MÓDULO
   Este módulo gerencia o carrinho de compras da loja do cliente.
   ELEMENTOS HTML: #botaoCarrinho, #cartButton, #areaCarrinhoLoja,
   #carrinhoLoja, #totalCarrinhoLoja, #cartCount, #contadorCarrinho
   PRODUTOS: 6 produtos com data-product-id
   FUNÇÕES: alternarCarrinhoLoja, adicionarProdutoLoja, aumentarProdutoLoja,
   diminuirProdutoLoja, removerProdutoLoja, esvaziarCarrinho,
   renderizarCarrinho, configurarIconeCarrinho, salvarCarrinho
   ========================================================= */

/* =========================================================
   MOSTRAR OU OCULTAR CARRINHO
========================================================= */

function alternarCarrinhoLoja() {

  const carrinho = document.getElementById(
    "areaCarrinhoLoja"
  );

  if (!carrinho) {
    return;
  }

  const estaOculto =
    carrinho.hidden ||
    carrinho.style.display === "none";

  carrinho.hidden = !estaOculto;

  carrinho.style.display =
    estaOculto ? "block" : "none";

  if (estaOculto) {

    carrinho.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }

}


/* =========================================================
   CONFIGURAR ÍCONE DO CARRINHO
========================================================= */

function configurarIconeCarrinho() {

  const botoes = document.querySelectorAll(
    "#botaoCarrinho, #cartButton, .cart-button, [data-open-cart]"
  );

  botoes.forEach(
    function (botao) {

      if (botao.dataset.carrinhoConfigurado) {
        return;
      }

      botao.addEventListener(
        "click",
        function (event) {

          event.preventDefault();

          alternarCarrinhoLoja();

        }
      );

      botao.dataset.carrinhoConfigurado = "true";

    }
  );

}


/* =========================================================
   RENDERIZAR CARRINHO
========================================================= */

function renderizarCarrinho() {

  const elemento = document.getElementById(
    "carrinhoLoja"
  );

  const totalElemento = document.getElementById(
    "totalCarrinhoLoja"
  );

  atualizarContadorCarrinho();

  configurarIconeCarrinho();

  if (!elemento) {
    return;
  }

  if (!carrinhoLoja.length) {

    elemento.innerHTML = `
      <div class="carrinho-vazio">
        <p>🛒 Seu carrinho está vazio.</p>
        <small>Adicione produtos para continuar.</small>
      </div>
    `;

    if (totalElemento) {
      totalElemento.textContent =
        formatarMoeda(0);
    }

    return;

  }

  let total = 0;

  elemento.innerHTML = carrinhoLoja.map(
    function (item) {

      const valor =
        Number(item.valor) || 0;

      const quantidade =
        Number(item.quantidade) || 0;

      const subtotal =
        valor * quantidade;

      total += subtotal;

      return `
        <div class="cart-item" data-cart-item="${escapeHTML(item.id)}">

          <div class="cart-item-info">

            <strong>
              ${escapeHTML(item.nome || "Produto")}
            </strong>

            <span>
              ${formatarMoeda(valor)} por unidade
            </span>

            <small>
              Subtotal: ${formatarMoeda(subtotal)}
            </small>

          </div>

          <div class="cart-item-actions">

            <button
              type="button"
              class="cart-quantity-button"
              onclick="diminuirProdutoLoja('${escapeHTML(item.id)}')"
              aria-label="Diminuir quantidade"
            >
              −
            </button>

            <span class="cart-quantity">
              ${quantidade}
            </span>

            <button
              type="button"
              class="cart-quantity-button"
              onclick="aumentarProdutoLoja('${escapeHTML(item.id)}')"
              aria-label="Aumentar quantidade"
            >
              +
            </button>

            <button
              type="button"
              class="cart-remove-button"
              onclick="removerProdutoLoja('${escapeHTML(item.id)}')"
            >
              🗑 Remover
            </button>

          </div>

        </div>
      `;

    }
  ).join("");

  if (totalElemento) {

    totalElemento.textContent =
      formatarMoeda(total);

  }

  const totalAlternativo = document.getElementById(
    "cartTotal"
  );

  if (totalAlternativo) {

    totalAlternativo.textContent =
      formatarMoeda(total);

  }

}


/* =========================================================
   ENVIAR PEDIDO PARA O WHATSAPP
========================================================= */

function enviarPedidoLoja(event) {

  event.preventDefault();

  if (!carrinhoLoja.length) {

    mostrarToast(
      "Adicione produtos ao carrinho antes de continuar.",
      "error"
    );

    return;

  }

  const nome = document.getElementById(
    "pedidoNome"
  )?.value.trim();

  const telefone = document.getElementById(
    "pedidoTelefone"
  )?.value.trim();

  const entrega = document.getElementById(
    "pedidoEntrega"
  )?.value;

  const endereco = document.getElementById(
    "pedidoEndereco"
  )?.value.trim();

  if (!nome || !telefone || !entrega) {

    mostrarToast(
      "Preencha nome, telefone e forma de entrega.",
      "error"
    );

    return;

  }

  if (
    entrega.toLowerCase().includes("entrega") &&
    !endereco
  ) {

    mostrarToast(
      "Informe o endereço para entrega.",
      "error"
    );

    return;

  }

  const total = calcularTotalCarrinho();

  let mensagem =
    "Olá! Quero fazer um pedido na " +
    NOME_EMPRESA +
    ".\n\n";

  mensagem +=
    "Nome: " + nome + "\n";

  mensagem +=
    "Telefone: " + telefone + "\n";

  mensagem +=
    "Forma de recebimento: " + entrega + "\n";

  if (endereco) {

    mensagem +=
      "Endereço: " + endereco + "\n";

  }

  mensagem += "\nPRODUTOS:\n";

  carrinhoLoja.forEach(
    function (item) {

      const subtotal =
        (Number(item.valor) || 0) *
        (Number(item.quantidade) || 0);

      mensagem +=
        "- " +
        item.nome +
        " | Quantidade: " +
        item.quantidade +
        " | Subtotal: " +
        formatarMoeda(subtotal) +
        "\n";

    }
  );

  mensagem +=
    "\nVALOR TOTAL: " +
    formatarMoeda(total);

  abrirWhatsApp(mensagem);

  const mensagemTela = document.getElementById(
    "mensagemPedidoLoja"
  );

  if (mensagemTela) {

    mensagemTela.textContent =
      "Pedido preparado. Confira o WhatsApp para enviar.";

  }

}


/* =========================================================
   DISPONIBILIZAR FUNÇÕES PARA O HTML
========================================================= */

window.adicionarProdutoLoja =
  adicionarProdutoLoja;

window.aumentarProdutoLoja =
  aumentarProdutoLoja;

window.diminuirProdutoLoja =
  diminuirProdutoLoja;

window.removerProdutoLoja =
  removerProdutoLoja;

window.esvaziarCarrinho =
  esvaziarCarrinho;

window.alternarCarrinhoLoja =
  alternarCarrinhoLoja;

/* =========================================================
   37. PESQUISA DE CLIENTES
========================================================= */

function configurarPesquisaCliente() {

  const campo =
    document.getElementById(
      "clientSearch"
    );


  if (!campo) {
    return;
  }


  campo.addEventListener(
    "input",
    function () {

      const termo =
        campo.value
          .trim()
          .toLowerCase();


      const clientes =
        obterDados(
          STORAGE_KEYS.clientes
        );


      const filtrados =
        clientes.filter(
          function (item) {

            return (

              String(
                item.nome ||
                ""
              )
                .toLowerCase()
                .includes(
                  termo
                ) ||

              String(
                item.email ||
                ""
              )
                .toLowerCase()
                .includes(
                  termo
                ) ||

              String(
                item.telefone ||
                ""
              )
                .toLowerCase()
                .includes(
                  termo
                )

            );

          }
        );


      renderizarClientes(
        filtrados
      );

    }
  );

}


/* =========================================================
   38. INICIALIZAÇÃO
========================================================= */

function iniciarSistema() {

  console.log(
    "================================="
  );

  console.log(
    "GUSTAVO & EMILY"
  );

  console.log(
    "Iniciando sistema..."
  );

  console.log(
    "================================="
  );


  /*
     Todas as configurações ficam
     protegidas por suas próprias
     verificações de elemento.

     Assim, se algum elemento do
     index.html não existir,
     o restante do sistema continua.
  */


  configurarTrocaDeTelasLogin();


  configurarCadastroCliente();


  configurarLoginCliente();


  configurarLoginAdmin();


  configurarLogout();


  configurarMenuAdmin();


  configurarMenuCliente();


  configurarAparelhosCliente();


  configurarOrcamento();


  configurarAdicionarCliente();


  configurarNovaOrdem();


  configurarFiltroOrdens();


  configurarAdicionarEstoque();


  configurarLoja();


  configurarPesquisaCliente();


  configurarAuthListener();


  configurarPix();


  mostrarLogin();


  atualizarDashboard();


  carregarClientes();


  carregarOrdens();


  carregarOrcamentosAdmin();


  carregarEstoque();


  atualizarFinanceiro();


  verificarSessao();


  console.log(
    "Sistema iniciado com sucesso."
  );

}


/* =========================================================
   39. FUNÇÕES GLOBAIS
========================================================= */

window.mostrarPaginaAdmin =
  mostrarPaginaAdmin;


window.mostrarPaginaCliente =
  mostrarPaginaCliente;



window.registrarSinal =
  registrarSinal;


window.excluirOrcamento =
  excluirOrcamento;


window.excluirCliente =
  excluirCliente;


window.excluirOrdem =
  excluirOrdem;


window.alterarStatusOrdem =
  alterarStatusOrdem;


window.excluirEstoque =
  excluirEstoque;


window.copiarPix =
  copiarPix;


window.abrirWhatsApp =
  abrirWhatsApp;


window.fecharModal =
  fecharModal;


/* =========================================================
   40. INICIAR
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    iniciarSistema
  );

} else {

  iniciarSistema();

}window.registrarSinal