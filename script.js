document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById("start-btn");
  const formContainer = document.getElementById("form-container");
  const form = document.getElementById("readiness-form");
  const resultSection = document.getElementById("result-section");
  const resultText = document.getElementById("result-text");

  startBtn.addEventListener("click", function () {
    formContainer.style.display = "block";
    startBtn.style.display = "none";
    window.scrollTo({ top: formContainer.offsetTop, behavior: "smooth" });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const answers = {};
    let score = 0;

    for (const [key, value] of formData.entries()) {
      if (!value || value === "Select") {
        alert("Please answer all questions before submitting.");
        return;
      }
      answers[key] = value;
    }

    const scoringRules = {
      cloudAlignment: { Yes: 3, No: 0 },
      budget: {
        "Over $50,000": 3,
        "$10,000–$50,000": 3,
        "Under $10,000": 2,
        "No budget": 0
      },
      drPlan: { Yes: 3, No: 0 },
      sensitiveData: { Yes: 0, No: 2 },
      compliance: { Yes: 3, "Not sure": 1, No: 0 },
      encryption: { Yes: 3, Partially: 2, No: 0 },
      sharedModel: { Yes: 3, No: 0 },
      bandwidth: { Yes: 3, "Not sure": 1, No: 0 },
      infrastructureModel: {
        "Mostly Cloud": 3,
        "Some Cloud": 2,
        Hybrid: 2,
        "Fully On-Premise": 0
      },
      serverAge: {
        "Less than 3 years": 3,
        "3–5 years": 2,
        "More than 5 years": 0
      },
      virtualized: { Yes: 3, No: 0 },
      infraDiagram: { Yes: 2, No: 0 },
      serverPlatform: {
        VMware: 3,
        "Hyper-V": 3,
        Mixed: 2,
        "Physical only": 0
      },
      trackCost: { Yes: 2, No: 0 },
      cyberTeam: {
        "In-house team": 3,
        "Outsourced provider": 2,
        "No dedicated team": 0
      },
      backupStorage: {
        "Cloud-based": 3,
        "Off-site": 2,
        "On-prem only": 1,
        "Not sure": 0
      },
      appArch: {
        Microservices: 3,
        "3-tier": 2,
        Mixed: 2,
        Monolithic: 0
      },
      legacyIssues: { No: 3, "Not sure": 1, Yes: 0 },
      saasTools: { Yes: 3, No: 0 },
      remoteAccess: { Yes: 2, No: 0 },
      latencyApps: { No: 2, "Not sure": 1, Yes: 0 },
      deviceType: {
        "Modern systems": 3,
        Mixed: 2,
        "Mostly outdated": 0
      },
      teamSkills: {
        Yes: 3,
        "Some members": 2,
        No: 0
      },
      externalHelp: {
        No: 3,
        Maybe: 2,
        Yes: 1
      },
      cloudDR: {
        "Already using": 3,
        Yes: 2,
        No: 0
      },
      seasonalLoad: { Yes: 2, No: 1 },
      scalingBenefit: { Yes: 3, Maybe: 2, No: 0 },
      currentCloud: { Yes: 3, No: 0 },
      pastChallenges: {
        No: 3,
        "Not applicable": 2,
        Yes: 1
      }
    };

    for (const [key, value] of Object.entries(answers)) {
      const rule = scoringRules[key];
      if (rule && rule.hasOwnProperty(value)) {
        score += rule[value];
      } else {
        score += 1;
      }
    }

    const maxPossible = 34 * 3;
    const percentScore = Math.round((score / maxPossible) * 100);

    // Decision outcome
    let category = "";
    if (percentScore >= 75) {
      category = "Ready for Lift & Shift Migration";
    } else if (percentScore >= 55) {
      category = "Needs Modernization Plan Before Migration";
    } else if (percentScore >= 35) {
      category = "Hybrid Cloud Recommended";
    } else {
      category = "Not Ready Yet";
    }

    const resultLabel = {
      "Ready for Lift & Shift Migration": "✅",
      "Needs Modernization Plan Before Migration": "⚙️",
      "Hybrid Cloud Recommended": "🌀",
      "Not Ready Yet": "🚫"
    }[category];

    const strategyMap = {
      "Not Ready Yet": [
        "Set clear cloud-aligned goals",
        "Start with small SaaS tools (e.g., Office 365)",
        "Train your IT team on basic cloud concepts",
        "Develop DR & compliance policies"
      ],
      "Hybrid Cloud Recommended": [
        "Migrate non-critical workloads first",
        "Implement hybrid backup & DR",
        "Modernize your internet and endpoints",
        "Evaluate IaaS and SaaS options side-by-side"
      ],
      "Needs Modernization Plan Before Migration": [
        "Refactor legacy apps into microservices",
        "Adopt DevOps and CI/CD",
        "Automate infrastructure with IaC",
        "Use pilot migration projects for high visibility apps"
      ],
      "Ready for Lift & Shift Migration": [
        "Use cloud migration tools to rehost VMs",
        "Apply full governance & monitoring",
        "Optimize cloud spend with tagging & automation",
        "Scale using autoscaling and global load balancing"
      ]
    };

    const strategyTips = strategyMap[category];
    let tipHTML = "<ul class='mt-3 small text-muted'>";
    strategyTips.forEach(tip => {
      tipHTML += `<li>✔️ ${tip}</li>`;
    });
    tipHTML += "</ul>";

    resultText.innerHTML = `${resultLabel} ${category} — Score: ${percentScore}/100` + tipHTML;
    resultText.className = "alert fs-5 fw-semibold " + getAlertClass(resultLabel);
    resultSection.style.display = "block";
    resultSection.scrollIntoView({ behavior: "smooth" });
  });

  function getAlertClass(label) {
    if (label === "✅") return "alert-success";
    if (label === "⚙️") return "alert-primary";
    if (label === "🌀") return "alert-warning";
    return "alert-danger";
  }
});
