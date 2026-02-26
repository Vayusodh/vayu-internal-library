(function () {
      "use strict";

      const sopData = [
        {
          title: "Gas Handling SOP",
          desc: "Cylinder handling, gas line inspection, and emergency control checklist.",
          file: "sop1.pdf",
          tags: ["gas", "safety", "facility"]
        },
        {
          title: "Cleanroom Protocol SOP",
          desc: "Gowning sequence, contamination prevention, and shift handoff rules.",
          file: "sop2.pdf",
          tags: ["cleanroom", "protocol", "ppe"]
        },
        {
          title: "Chemical Safety SOP",
          desc: "Storage matrix, spill response, and disposal standards for hazardous materials.",
          file: "sop3.pdf",
          tags: ["chemical", "hazard", "storage"]
        }
      ];

      const allowedFiles = new Set(sopData.map((item) => item.file));
      const safeFilePattern = /^[a-zA-Z0-9_-]+\.pdf$/;

      const homeBtn = document.getElementById("homeBtn");
      const searchInput = document.getElementById("searchInput");
      const sopGrid = document.getElementById("sopGrid");
      const emptyState = document.getElementById("emptyState");
      const viewer = document.getElementById("viewer");
      const closeViewer = document.getElementById("closeViewer");
      const pdfFrame = document.getElementById("pdfFrame");
      const viewerTitle = document.getElementById("viewerTitle");
      const quickTags = document.getElementById("quickTags");

      const topTags = [...new Set(sopData.flatMap((item) => item.tags))].slice(0, 6);

      function sanitizeFile(file) {
        if (!safeFilePattern.test(file)) return null;
        if (!allowedFiles.has(file)) return null;
        return file;
      }

      function openViewer(file, title) {
        const safeFile = sanitizeFile(file);
        if (!safeFile) {
          window.alert("Blocked unsafe file request.");
          return;
        }

        viewerTitle.textContent = title;
        pdfFrame.src = encodeURI(safeFile);
        viewer.classList.add("active");
        document.body.style.overflow = "hidden";
        closeViewer.focus();
      }

      function closeOverlay() {
        viewer.classList.remove("active");
        pdfFrame.src = "";
        document.body.style.overflow = "";
      }

      function createCard(item) {
        const card = document.createElement("article");
        card.className = "sop-card";

        const title = document.createElement("h3");
        title.textContent = item.title;

        const desc = document.createElement("p");
        desc.textContent = item.desc;

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Open Secure Viewer";
        button.addEventListener("click", function () {
          openViewer(item.file, item.title);
        });

        card.append(title, desc, button);
        return card;
      }

      function renderSOPs(query) {
        sopGrid.innerHTML = "";
        const keyword = query.trim().toLowerCase();
        const filtered = sopData.filter((item) => {
          const haystack = `${item.title} ${item.desc} ${item.tags.join(" ")}`.toLowerCase();
          return haystack.includes(keyword);
        });

        filtered.forEach((item) => sopGrid.appendChild(createCard(item)));
        emptyState.style.display = filtered.length ? "none" : "block";
      }

      function renderTags() {
        topTags.forEach((tag) => {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.textContent = `#${tag}`;
          chip.addEventListener("click", function () {
            searchInput.value = tag;
            renderSOPs(tag);
            searchInput.focus();
          });
          quickTags.appendChild(chip);
        });
      }

      homeBtn.addEventListener("click", function () {
        window.location.assign("index.html");
      });

      closeViewer.addEventListener("click", closeOverlay);

      viewer.addEventListener("click", function (event) {
        if (event.target === viewer) closeOverlay();
      });

      searchInput.addEventListener("input", function () {
        renderSOPs(searchInput.value);
      });

      window.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          if (viewer.classList.contains("active")) {
            closeOverlay();
            return;
          }
          searchInput.value = "";
          renderSOPs("");
        }
      });

      renderTags();
      renderSOPs("");
    })();
