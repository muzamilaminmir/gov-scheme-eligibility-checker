document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('eligibilityForm');
    const resultsSection = document.getElementById('results');
    const resultsToolbar = document.getElementById('results-toolbar');
    const placeholder = document.getElementById('placeholder');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const loader = document.getElementById('loader');
    const searchInput = document.getElementById('schemeSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const shareBtn = document.getElementById('shareBtn');

    let allSchemesData = { eligible: [], notEligible: [] };
    let activeFilter = 'All';

    // 1. Form Submission Handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI Feedback
        submitBtn.disabled = true;
        btnText.textContent = "Scanning Database...";
        loader.classList.remove('hidden');

        const formData = new FormData(form);
        const userData = {
            age: parseInt(formData.get('age')),
            income: parseInt(formData.get('income')),
            state: formData.get('state'),
            occupation: formData.get('occupation'),
            gender: formData.get('gender'),
            education: formData.get('education')
        };

        try {
            const response = await fetch('/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!response.ok) throw new Error('Backend Error');

            const data = await response.json();

            // Store data for local filtering/searching
            allSchemesData.eligible = data.eligible_schemes;
            allSchemesData.notEligible = data.not_eligible_schemes;

            renderAll(allSchemesData.eligible, allSchemesData.notEligible);

            // UI Transition
            placeholder.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            resultsToolbar.classList.remove('hidden');

            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            console.error(error);
            alert('Security Error or Connection Lost. Please ensure the backend is active on port 8000.');
        } finally {
            submitBtn.disabled = false;
            btnText.textContent = "Scan My Eligibility";
            loader.classList.add('hidden');
        }
    });

    // 2. Rendering Logic
    function renderAll(eligible, notEligible) {
        renderEligible(eligible);
        renderNotEligible(notEligible);
    }

    function renderEligible(schemes) {
        const container = document.getElementById('eligibleCards');
        const template = document.getElementById('eligibleCardTemplate');
        container.innerHTML = '';

        if (schemes.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-12 text-center bg-slate-50 rounded-3xl border border-slate-100">
                    <p class="text-slate-400 font-medium italic">No matching schemes found for this filter/search.</p>
                </div>`;
            return;
        }

        schemes.forEach((scheme, index) => {
            const clone = template.content.cloneNode(true);

            // Fill Data
            clone.querySelector('.scheme-name').textContent = scheme.name;
            clone.querySelector('.scheme-desc').textContent = scheme.description;
            clone.querySelector('.badge-type').textContent = scheme.type;
            clone.querySelector('.apply-link').href = scheme.apply_link;

            // Color Coding Type
            if (scheme.type === 'State') {
                clone.querySelector('.badge-type').classList.replace('bg-emerald-50', 'bg-blue-50');
                clone.querySelector('.badge-type').classList.replace('text-emerald-700', 'text-blue-700');
            }

            // Reasons
            const reasonContainer = clone.querySelector('.reasons-container');
            scheme.why_eligible.forEach(reason => {
                const badge = document.createElement('span');
                badge.className = 'match-badge';
                badge.innerHTML = `<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg> ${reason}`;
                reasonContainer.appendChild(badge);
            });

            // Set Delay for staggering animation
            const card = clone.querySelector('.scheme-card');
            card.style.animationDelay = `${index * 100}ms`;
            card.classList.add('animate-fade-in');

            container.appendChild(clone);
        });
    }

    function renderNotEligible(schemes) {
        const container = document.getElementById('notEligibleContainer');
        container.innerHTML = '';

        schemes.forEach((scheme, index) => {
            const item = document.createElement('div');
            item.className = 'bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-slate-300 animate-fade-in';
            item.style.animationDelay = `${(index + 3) * 100}ms`;

            item.innerHTML = `
                <button class="w-full px-6 py-4 flex justify-between items-center text-left collapse-btn" data-id="${index}">
                    <div>
                        <span class="font-bold text-slate-800">${scheme.name}</span>
                        <span class="ml-3 text-[9px] font-bold text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded uppercase">${scheme.type}</span>
                    </div>
                    <svg class="h-5 w-5 text-slate-300 transform transition-transform duration-300" 
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div class="rejection-accordion px-6">
                    <p class="text-sm text-slate-500 mb-4">${scheme.description}</p>
                    <div class="bg-red-50/50 border border-red-100 rounded-xl p-4">
                        <p class="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Requirement Gaps</p>
                        <ul class="space-y-1.5">
                            ${scheme.why_not.map(reason => `
                                <li class="text-sm text-red-700 flex items-start">
                                    <span class="mr-2 mt-1">•</span> ${reason}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
            container.appendChild(item);
        });

        // Re-attach listeners
        container.querySelectorAll('.collapse-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const accordion = btn.nextElementSibling;
                const icon = btn.querySelector('svg');
                accordion.classList.toggle('active');
                icon.classList.toggle('rotate-180');
            });
        });
    }

    // 3. Search & Filter Logic
    function applySearchAndFilter() {
        const query = searchInput.value.toLowerCase();

        const filterFn = (scheme) => {
            const matchesSearch = scheme.name.toLowerCase().includes(query);
            const matchesFilter = activeFilter === 'All' || scheme.type === activeFilter;
            return matchesSearch && matchesFilter;
        };

        const filteredEligible = allSchemesData.eligible.filter(filterFn);
        const filteredNotEligible = allSchemesData.notEligible.filter(filterFn);

        renderAll(filteredEligible, filteredNotEligible);
    }

    searchInput.addEventListener('input', applySearchAndFilter);

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            applySearchAndFilter();
        });
    });

    // 4. Share Feature
    shareBtn.addEventListener('click', () => {
        if (allSchemesData.eligible.length === 0) {
            alert('No results to share yet. Run a scan first!');
            return;
        }

        const count = allSchemesData.eligible.length;
        const names = allSchemesData.eligible.slice(0, 3).map(s => s.name).join(', ');
        const text = `GovScheme India: Based on my profile, I am eligible for ${count} schemes including ${names}. Check yours at http://localhost:8000!`;

        navigator.clipboard.writeText(text).then(() => {
            const originalIcon = shareBtn.innerHTML;
            shareBtn.innerHTML = `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="2"/></svg>`;
            shareBtn.classList.add('bg-emerald-500', 'text-white');
            setTimeout(() => {
                shareBtn.innerHTML = originalIcon;
                shareBtn.classList.remove('bg-emerald-500', 'text-white');
            }, 2000);
        });
    });
});
