/* js_assets/main.js */
(() => {
  "use strict";

  // =========================
  // Helpers
  // =========================
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const escapeText = (s) => String(s ?? "");
  const slug = (s) =>
    String(s ?? "")
      .toLowerCase()
      .trim()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const moneyToNumber = (text) => {
    const n = parseFloat(String(text).replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const formatZAR = (value) => `R ${Number(value || 0).toFixed(2)}`;

  const debounce = (fn, delay = 200) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };

  // =========================
  // 1) NAV: hamburger + active link
  // =========================
  function initNav() {
    const hamburger = $("#hamburger");
    const navLinks = $("#navLinks") || $(".nav-links");

    const setOpen = (open) => {
      if (!navLinks) return;
      navLinks.classList.toggle("open", !!open);
      hamburger?.setAttribute("aria-expanded", open ? "true" : "false");
    };

    if (hamburger && navLinks) {
      hamburger.setAttribute("aria-expanded", "false");

      hamburger.addEventListener("click", () => {
        setOpen(!navLinks.classList.contains("open"));
      });

      navLinks.addEventListener("click", (e) => {
        if (e.target.closest("a")) setOpen(false);
      });

      document.addEventListener("click", (e) => {
        if (!navLinks.classList.contains("open")) return;
        if (navLinks.contains(e.target) || hamburger.contains(e.target)) return;
        setOpen(false);
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setOpen(false);
      });
    }

    // Active link highlight (SEO + UX)
    const currentFile = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    $$(".nav-links a").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (!href) return;

      // handle homepage cases
      if ((currentFile === "" || currentFile === "index.html") && (href === "index.html" || href === "#home")) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
        return;
      }

      if (!href.startsWith("#") && href === currentFile) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  // =========================
  // 2) Animation on scroll (IntersectionObserver)
  // =========================
  function initScrollAnimations() {
    const targets = $$("section, .product-card, .about-box, .contact-info, .map");
    targets.forEach((el) => el.classList.add("reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => io.observe(el));
  }

  // NOTE: Add CSS for animation (in your style.css):
  // .reveal { opacity:0; transform: translateY(16px); transition: .6s ease; }
  // .reveal.in-view { opacity:1; transform: none; }

  // =========================
  // 3) Lightbox Gallery (modal)
  // =========================
  function initLightbox() {
    const overlayId = "lightboxOverlay";
    let overlay = $("#" + overlayId);

    const buildOverlay = () => {
      overlay = document.createElement("div");
      overlay.id = overlayId;
      overlay.style.cssText = `
        position:fixed; inset:0; display:none; z-index:10000;
        background:rgba(0,0,0,.75);
        align-items:center; justify-content:center;
        padding:24px;
      `;
      overlay.innerHTML = `
        <figure style="margin:0; max-width:min(920px, 96vw); width:100%;">
          <img id="lightboxImg" alt="" style="width:100%; max-height:80vh; object-fit:contain; display:block; border-radius:10px;">
          <figcaption id="lightboxCap" style="color:#fff; margin-top:10px; opacity:.92;"></figcaption>
          <button id="lightboxClose" type="button"
            style="position:fixed; top:16px; right:16px; padding:10px 12px; cursor:pointer;">
            Close
          </button>
        </figure>
      `;
      document.body.appendChild(overlay);

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
      });

      $("#lightboxClose", overlay).addEventListener("click", close);

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });
    };

    const open = (src, caption = "") => {
      if (!overlay) buildOverlay();
      const img = $("#lightboxImg", overlay);
      const cap = $("#lightboxCap", overlay);
      img.src = src;
      cap.textContent = caption;
      overlay.style.display = "flex";
    };

    const close = () => {
      if (!overlay) return;
      overlay.style.display = "none";
      const img = $("#lightboxImg", overlay);
      img.src = "";
    };

    // Click any product/staff image to open
    document.addEventListener("click", (e) => {
      const img = e.target.closest(".product-card img, .hero-image img, .footer-logo img");
      if (!img) return;

      const src = img.getAttribute("src");
      if (!src) return;
      const caption = img.getAttribute("alt") || "";
      open(src, caption);
    });
  }

  // =========================
  // 4) Dynamic Menu Load + Search + Sort
  // =========================
  async function initDynamicMenu() {
    const grid = $("#menuGrid");
    if (!grid) return; // only on Orders page where you added the container

    const searchEl = $("#menuSearch");
    const catEl = $("#menuCategory");
    const sortEl = $("#menuSort");

    let items = [];
    try {
      const res = await fetch("data/menu.json", { cache: "no-store" });
      if (!res.ok) throw new Error("Menu fetch failed");
      items = await res.json();
      if (!Array.isArray(items)) throw new Error("menu.json must be an array");
    } catch (err) {
      console.warn("Dynamic menu failed. Fix data/menu.json or path.", err);
      grid.textContent = "Menu failed to load. Check data/menu.json.";
      return;
    }

    // Fill category dropdown
    const categories = Array.from(new Set(items.map((i) => i.category))).sort();
    if (catEl) {
      categories.forEach((c) => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        catEl.appendChild(opt);
      });
    }

    const render = () => {
      const q = (searchEl?.value || "").trim().toLowerCase();
      const cat = catEl?.value || "all";
      const sort = sortEl?.value || "default";

      let filtered = items.filter((i) => {
        const matchText =
          !q ||
          i.name.toLowerCase().includes(q) ||
          (i.category || "").toLowerCase().includes(q);

        const matchCat = cat === "all" || i.category === cat;
        return matchText && matchCat;
      });

      if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
      if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);
      if (sort === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));

      grid.innerHTML = "";
      const frag = document.createDocumentFragment();

      filtered.forEach((item) => {
        const card = document.createElement("div");
        card.className = "product-card";

        const img = document.createElement("img");
        img.src = item.img;
        img.alt = item.name;
        img.loading = "lazy";

        const h3 = document.createElement("h3");
        h3.className = "category";
        h3.textContent = item.name;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = formatZAR(item.price);

        const btn = document.createElement("button");
        btn.className = "btn-add";
        btn.type = "button";
        btn.textContent = "Add to Cart";
        btn.dataset.cart = "add";
        btn.dataset.id = item.id || `${slug(item.name)}-${item.price}`;
        btn.dataset.name = item.name;
        btn.dataset.price = String(item.price);
        btn.dataset.img = item.img;

        card.append(img, h3, price, btn);
        frag.appendChild(card);
      });

      grid.appendChild(frag);

      // If no results:
      if (!filtered.length) {
        const p = document.createElement("p");
        p.textContent = "No meals match your search.";
        grid.appendChild(p);
      }
    };

    const rerender = debounce(render, 150);
    searchEl?.addEventListener("input", rerender);
    catEl?.addEventListener("change", render);
    sortEl?.addEventListener("change", render);

    render();
  }

  // =========================
  // 5) Cart (modal) + localStorage (interactive element)
  // =========================
  const CART_KEY = "dijong_cart_v2";
  const getCart = () => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };
  const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

  const calcCount = (cart) => cart.reduce((sum, it) => sum + (it.qty || 0), 0);
  const calcTotal = (cart) => cart.reduce((sum, it) => sum + (it.qty || 0) * (it.price || 0), 0);

  function initCart() {
    const countEl = $("#cart-count");
    const cartBtn = $(".cart-btn");

    const updateBadge = () => {
      if (!countEl) return;
      countEl.textContent = String(calcCount(getCart()));
    };

    const ensureCartModal = () => {
      if ($("#cartModal")) return $("#cartModal");

      const wrap = document.createElement("div");
      wrap.id = "cartModal";
      wrap.style.cssText = `position:fixed; inset:0; display:none; z-index:10001;`;

      wrap.innerHTML = `
        <div id="cartBackdrop" style="position:absolute; inset:0; background:rgba(0,0,0,.55);"></div>
        <aside style="
          position:absolute; right:0; top:0; height:100%;
          width:min(420px, 92vw);
          background:#101010; color:#fff;
          padding:16px; overflow:auto;">
          <div style="display:flex; justify-content:space-between; gap:12px; align-items:center;">
            <h2 style="margin:0;">Cart</h2>
            <button id="cartClose" type="button" style="padding:8px 10px; cursor:pointer;">Close</button>
          </div>

          <div id="cartItems" style="margin-top:12px;"></div>

          <div style="border-top:1px solid rgba(255,255,255,.15); margin-top:12px; padding-top:12px;">
            <div style="display:flex; justify-content:space-between;">
              <strong>Total</strong>
              <strong id="cartTotal">R 0.00</strong>
            </div>

            <div style="display:flex; gap:10px; margin-top:12px;">
              <button id="cartClear" type="button" style="flex:1; padding:10px; cursor:pointer;">Clear</button>
              <button id="cartWhatsApp" type="button" style="flex:1; padding:10px; cursor:pointer;">Order via WhatsApp</button>
            </div>
          </div>
        </aside>
      `;
      document.body.appendChild(wrap);

      $("#cartBackdrop", wrap).addEventListener("click", () => close());
      $("#cartClose", wrap).addEventListener("click", () => close());

      $("#cartClear", wrap).addEventListener("click", () => {
        saveCart([]);
        render();
        updateBadge();
      });

      $("#cartWhatsApp", wrap).addEventListener("click", () => {
        const cart = getCart();
        if (!cart.length) return alert("Cart is empty.");

        const lines = cart.map((i) => `• ${i.name} x${i.qty} (${formatZAR(i.price)})`);
        const msg =
          `Hello Dijong, I would like to order:\n` +
          lines.join("\n") +
          `\n\nTotal: ${formatZAR(calcTotal(cart))}`;

        // Put your WhatsApp number here in international format without +
        const whatsappNumber = "27834487403";
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank", "noopener,noreferrer");
      });

      // Qty controls (event delegation)
      wrap.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;
        const { action, id } = btn.dataset;

        const cart = getCart();
        const idx = cart.findIndex((x) => x.id === id);
        if (idx === -1) return;

        if (action === "inc") cart[idx].qty += 1;
        if (action === "dec") cart[idx].qty = Math.max(1, cart[idx].qty - 1);
        if (action === "remove") cart.splice(idx, 1);

        saveCart(cart);
        render();
        updateBadge();
      });

      return wrap;
    };

    const open = () => {
      const modal = ensureCartModal();
      modal.style.display = "block";
      render();
    };

    const close = () => {
      const modal = $("#cartModal");
      if (modal) modal.style.display = "none";
    };

    const render = () => {
      const modal = $("#cartModal");
      if (!modal) return;

      const cart = getCart();
      const itemsEl = $("#cartItems", modal);
      const totalEl = $("#cartTotal", modal);

      totalEl.textContent = formatZAR(calcTotal(cart));
      itemsEl.innerHTML = "";

      if (!cart.length) {
        const p = document.createElement("p");
        p.textContent = "Your cart is empty.";
        itemsEl.appendChild(p);
        return;
      }

      cart.forEach((it) => {
        const row = document.createElement("div");
        row.style.cssText = "padding:10px 0; border-bottom:1px solid rgba(255,255,255,.12);";

        row.innerHTML = `
          <div style="display:flex; justify-content:space-between; gap:10px;">
            <strong>${escapeText(it.name)}</strong>
            <span>${formatZAR(it.price * it.qty)}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px; margin-top:8px;">
            <button type="button" data-action="dec" data-id="${escapeText(it.id)}" style="padding:6px 10px; cursor:pointer;">−</button>
            <span style="min-width:24px; text-align:center;">${it.qty}</span>
            <button type="button" data-action="inc" data-id="${escapeText(it.id)}" style="padding:6px 10px; cursor:pointer;">+</button>
            <button type="button" data-action="remove" data-id="${escapeText(it.id)}"
              style="margin-left:auto; padding:6px 10px; cursor:pointer;">Remove</button>
          </div>
        `;
        itemsEl.appendChild(row);
      });
    };

    // Add-to-cart clicks
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("button.btn-add, button[data-cart='add']");
      if (!btn) return;

      // Only treat as add-to-cart if it looks like a product card button
      const card = btn.closest(".product-card");
      if (!card) return;
      const priceEl = $(".price", card);
      if (!priceEl && !btn.dataset.price) return;

      const name =
        btn.dataset.name ||
        $(".category", card)?.textContent?.trim() ||
        "Item";

      const price =
        btn.dataset.price
          ? Number(btn.dataset.price)
          : moneyToNumber(priceEl.textContent);

      const img =
        btn.dataset.img ||
        $("img", card)?.getAttribute("src") ||
        "";

      const id = btn.dataset.id || `${slug(name)}-${price}`;

      const cart = getCart();
      const existing = cart.find((x) => x.id === id);
      if (existing) existing.qty += 1;
      else cart.push({ id, name, price, img, qty: 1 });

      saveCart(cart);
      updateBadge();
    });

    cartBtn?.addEventListener("click", open);
    updateBadge();
  }

  // =========================
  // 6) Leaflet interactive maps
  // =========================
  function initLeafletMaps() {
    const maps = $$(".leaflet-map");
    if (!maps.length) return;

    // Only run if Leaflet is loaded
    if (!window.L) {
      console.warn("Leaflet not loaded. Add Leaflet <script> on contact.html.");
      return;
    }

    maps.forEach((el) => {
      const lat = Number(el.dataset.lat);
      const lng = Number(el.dataset.lng);
      const title = el.dataset.title || "Location";

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const map = L.map(el).setView([lat, lng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      L.marker([lat, lng]).addTo(map).bindPopup(title);
    });
  }

  // =========================
  // 7) Form validation + error handling + AJAX + compile to email
  // =========================
  const EMAIL_TO = "dijongafricancuisine4002@gmail.com";

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(email || "").trim());

  const isValidName = (name) =>
    /^[a-zA-Z\s]{2,50}$/.test(String(name || "").trim());

  const isValidPhone = (phone) => {
    const p = String(phone || "").trim();
    // allow +, spaces, digits; min 10 digits
    const digits = p.replace(/[^\d]/g, "");
    return /^[+\d\s-]{7,20}$/.test(p) && digits.length >= 10;
  };

  function setFieldError(input, msg) {
    input.classList.add("has-error");
    let small = input.parentElement.querySelector(".field-error");
    if (!small) {
      small = document.createElement("small");
      small.className = "field-error";
      small.style.cssText = "display:block; color:#ffb4b4; margin-top:6px;";
      input.insertAdjacentElement("afterend", small);
    }
    small.textContent = msg;
  }

  function clearFieldError(input) {
    input.classList.remove("has-error");
    const small = input.parentElement.querySelector(".field-error");
    if (small) small.remove();
  }

  function buildMailto({ to, subject, body }) {
    return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  async function ajaxSubmit(form) {
    const url = form.getAttribute("action");
    if (!url) return { ok: false, message: "No form action set." };

    const fd = new FormData(form);

    try {
      const res = await fetch(url, {
        method: (form.getAttribute("method") || "POST").toUpperCase(),
        body: fd,
        headers: { Accept: "application/json" },
      });
      return { ok: res.ok, message: res.ok ? "Sent successfully." : "Submission failed." };
    } catch (e) {
      return { ok: false, message: "Network error while sending." };
    }
  }

  function initForms() {
    const forms = $$("form.contact-form, form.booking-form");
    if (!forms.length) return;

    forms.forEach((form) => {
      const isContact = form.id === "contactForm";
      const isEnquiry = form.id === "enquiryForm";
      const isBooking = form.classList.contains("booking-form");

      const nameEl = form.querySelector("[name='name'], #reservation-name");
      const emailEl = form.querySelector("[name='email']");
      const phoneEl = form.querySelector("[name='phone']");
      const msgEl = form.querySelector("[name='message']");
      const dateEl = form.querySelector("[name='booking-date'], #booking-date");

      // live validation clear
      $$("input, textarea, select", form).forEach((el) => {
        el.addEventListener("input", () => clearFieldError(el));
        el.addEventListener("change", () => clearFieldError(el));
      });

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        let ok = true;

        // ---- Contact / Enquiry validations
        if (isContact || isEnquiry) {
          if (nameEl && !isValidName(nameEl.value)) {
            ok = false;
            setFieldError(nameEl, "Enter a valid name (letters and spaces only).");
          }

          if (emailEl && !isValidEmail(emailEl.value)) {
            ok = false;
            setFieldError(emailEl, "Enter a valid email address.");
          }

          if (isEnquiry && phoneEl && !isValidPhone(phoneEl.value)) {
            ok = false;
            setFieldError(phoneEl, "Enter a valid phone number (at least 10 digits).");
          }

          if (msgEl && String(msgEl.value || "").trim().length < 10) {
            ok = false;
            setFieldError(msgEl, "Message must be at least 10 characters.");
          }

          if (isEnquiry) {
            const typeEl = $("#enquiry-type");
            if (typeEl && !typeEl.value) {
              ok = false;
              setFieldError(typeEl, "Please select an enquiry type.");
            }
          }
        }

        // ---- Booking validations
        if (isBooking) {
          if (dateEl) {
            const chosen = new Date(dateEl.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (!(chosen instanceof Date) || Number.isNaN(chosen.getTime()) || chosen < today) {
              ok = false;
              setFieldError(dateEl, "Please choose a valid future date.");
            }
          }
          if (nameEl && String(nameEl.value || "").trim().length < 2) {
            ok = false;
            setFieldError(nameEl, "Please enter the reservation name.");
          }
        }

        if (!ok) return;

        // ---- AJAX submission (requirement)
        let ajaxResult = null;
        if (form.dataset.ajax === "true") {
          ajaxResult = await ajaxSubmit(form);
        }

        // ---- Compile into email (requirement for contact.html)
        // For CONTACT form: open mail client with compiled email.
        if (isContact) {
          const subject = `Dijong Website Contact: ${nameEl?.value || "Customer"}`;
          const body =
            `Name: ${nameEl?.value || ""}\n` +
            `Email: ${emailEl?.value || ""}\n\n` +
            `Message:\n${msgEl?.value || ""}\n\n` +
            (ajaxResult ? `AJAX status: ${ajaxResult.message}\n` : "");

          const mailto = buildMailto({ to: EMAIL_TO, subject, body });

          // Shows they can send email to recipient in code
          window.location.href = mailto;

          form.reset();
          return;
        }

        // For ENQUIRY: show a processed response (cost/availability/etc.)
        if (isEnquiry) {
          const type = $("#enquiry-type")?.value || "other";

          let response = "Thanks! We received your enquiry and will reply ASAP.";
          if (type === "table-booking") response = "Thanks! We’ll confirm table availability and reply within 1 business day.";
          if (type === "catering") response = "Thanks! Our catering team will share package options and pricing based on your event size.";
          if (type === "menu-question") response = "Thanks! We’ll answer your menu question and send recommendations.";
          if (type === "feedback") response = "Thank you for your feedback. We appreciate it and will review it carefully.";

          alert(response + (ajaxResult ? `\n\n(Background submit: ${ajaxResult.message})` : ""));
          form.reset();
          return;
        }

        // For BOOKING: store booking locally (proof of DOM + JS processing)
        if (isBooking) {
          const bookingsKey = "dijong_bookings_v1";
          const existing = JSON.parse(localStorage.getItem(bookingsKey) || "[]");
          existing.push({
            date: dateEl?.value || "",
            name: nameEl?.value || "",
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem(bookingsKey, JSON.stringify(existing));

          alert(`Booking received!\nName: ${nameEl?.value}\nDate: ${dateEl?.value}`);
          form.reset();
        }
      });
    });
  }

  // =========================
  // 8) Performance: lazy-load images where possible
  // =========================
  function initLazyImages() {
    $$("img").forEach((img) => {
      // avoid breaking logos if you don't want
      if (img.closest(".logo-area, .footer-logo")) return;
      if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    });
  }

  // =========================
  // Boot
  // =========================
  initNav();
  initScrollAnimations();
  initLightbox();
  initDynamicMenu();
  initCart();
  initLeafletMaps();
  initForms();
  initLazyImages();
})();