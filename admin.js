// ============================================
// TN19 MOBILES - ADMIN DASHBOARD
// ============================================

// Wait for Firebase module to load
function waitForFirebase() {
    return new Promise((resolve) => {
        const check = () => {
            if (window.TN19Firebase && window.TN19Firebase.db) {
                resolve(window.TN19Firebase);
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });
}

(async () => {
    const FB = await waitForFirebase();
    // Use the Firestore and Auth instances directly (compat API)
    const db = FB.db;
    const authInstance = FB.auth;

    // === DOM Elements ===
    const adminLogin = document.getElementById('adminLogin');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const passwordToggle = document.getElementById('passwordToggle');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminEmailEl = document.getElementById('adminEmail');

    // Sidebar
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const adminSidebar = document.getElementById('adminSidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
    const topbarTitle = document.getElementById('topbarTitle');

    // Enquiries
    const enquiriesList = document.getElementById('enquiriesList');
    const enquiriesEmpty = document.getElementById('enquiriesEmpty');
    const enquirySearch = document.getElementById('enquirySearch');
    const enquiryFilter = document.getElementById('enquiryFilter');
    const totalEnquiriesEl = document.getElementById('totalEnquiries');
    const newEnquiriesEl = document.getElementById('newEnquiries');
    const readEnquiriesEl = document.getElementById('readEnquiries');
    const enquiryBadge = document.getElementById('enquiryBadge');

    // Devices
    const devicesTableBody = document.getElementById('devicesTableBody');
    const devicesEmpty = document.getElementById('devicesEmpty');
    const devicesTable = document.getElementById('devicesTable');
    const deviceSearch = document.getElementById('deviceSearch');
    const deviceFilter = document.getElementById('deviceFilter');
    const addDeviceBtn = document.getElementById('addDeviceBtn');
    const totalDevicesEl = document.getElementById('totalDevices');
    const activeDevicesEl = document.getElementById('activeDevices');

    // Device Modal
    const deviceModal = document.getElementById('deviceModal');
    const deviceForm = document.getElementById('deviceForm');
    const modalTitle = document.getElementById('modalTitle');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const deviceEditId = document.getElementById('deviceEditId');

    // Enquiry Modal
    const enquiryModal = document.getElementById('enquiryModal');
    const enquiryDetailContent = document.getElementById('enquiryDetailContent');
    const enquiryModalClose = document.getElementById('enquiryModalClose');
    const enquiryModalCloseBtn = document.getElementById('enquiryModalCloseBtn');
    const enquiryDeleteBtn = document.getElementById('enquiryDeleteBtn');

    // Settings
    const seedDataBtn = document.getElementById('seedDataBtn');

    let allEnquiries = [];
    let allDevices = [];
    let currentEnquiryId = null;

    // ============================================
    // AUTHENTICATION
    // ============================================

    // Password toggle
    passwordToggle.addEventListener('click', () => {
        const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        loginPassword.setAttribute('type', type);
        const icon = passwordToggle.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Signing in...</span>';

        try {
            await authInstance.signInWithEmailAndPassword(loginEmail.value, loginPassword.value);
        } catch (error) {
            const errorMessages = {
                'auth/user-not-found': 'No account found with this email.',
                'auth/wrong-password': 'Incorrect password.',
                'auth/invalid-email': 'Invalid email address.',
                'auth/too-many-requests': 'Too many failed attempts. Try again later.',
                'auth/invalid-credential': 'Invalid email or password.'
            };
            loginError.textContent = errorMessages[error.code] || 'Login failed. Please try again.';
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Sign In</span>';
        }
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        try {
            await authInstance.signOut();
        } catch (error) {
            showToast('Logout failed', 'fas fa-exclamation-circle');
        }
    });

    // Auth state observer
    authInstance.onAuthStateChanged((user) => {
        if (user) {
            adminLogin.style.display = 'none';
            adminDashboard.style.display = 'flex';
            adminEmailEl.textContent = user.email;
            loadEnquiries();
            loadDevices();
        } else {
            adminLogin.style.display = 'flex';
            adminDashboard.style.display = 'none';
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>Sign In</span>';
        }
    });

    // ============================================
    // SIDEBAR NAVIGATION
    // ============================================

    sidebarToggle.addEventListener('click', () => {
        adminSidebar.classList.toggle('open');
    });

    sidebarClose.addEventListener('click', () => {
        adminSidebar.classList.remove('open');
    });

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');

            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.getElementById('tab-' + tab).classList.add('active');

            const titles = { enquiries: 'Enquiries', devices: 'Devices', settings: 'Settings' };
            topbarTitle.textContent = titles[tab] || 'Dashboard';

            adminSidebar.classList.remove('open');
        });
    });

    // ============================================
    // ENQUIRIES - Using compat API directly
    // ============================================

    function loadEnquiries() {
        db.collection('enquiries').orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                allEnquiries = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                updateEnquiryStats();
                renderEnquiries();
            });
    }

    function updateEnquiryStats() {
        const total = allEnquiries.length;
        const newCount = allEnquiries.filter(e => e.status === 'new').length;
        const readCount = allEnquiries.filter(e => e.status === 'read').length;

        totalEnquiriesEl.textContent = total;
        newEnquiriesEl.textContent = newCount;
        readEnquiriesEl.textContent = readCount;
        enquiryBadge.textContent = newCount;
        enquiryBadge.style.display = newCount > 0 ? 'inline' : 'none';
    }

    function renderEnquiries() {
        const search = enquirySearch.value.toLowerCase();
        const filter = enquiryFilter.value;

        let filtered = allEnquiries.filter(e => {
            const matchesSearch = !search ||
                (e.name && e.name.toLowerCase().includes(search)) ||
                (e.email && e.email.toLowerCase().includes(search)) ||
                (e.phone && e.phone.toLowerCase().includes(search)) ||
                (e.message && e.message.toLowerCase().includes(search));
            const matchesFilter = filter === 'all' || e.status === filter;
            return matchesSearch && matchesFilter;
        });

        // Clear existing cards (keep empty state)
        const existingCards = enquiriesList.querySelectorAll('.enquiry-card');
        existingCards.forEach(c => c.remove());

        if (filtered.length === 0) {
            enquiriesEmpty.style.display = 'flex';
            return;
        }

        enquiriesEmpty.style.display = 'none';

        filtered.forEach(enquiry => {
            const card = document.createElement('div');
            card.className = 'enquiry-card' + (enquiry.status === 'new' ? ' unread' : '');
            card.innerHTML = `
                <div class="enquiry-card-header">
                    <div class="enquiry-card-info">
                        <h4>${escapeHtml(enquiry.name || 'Unknown')}</h4>
                        <span class="enquiry-email">${escapeHtml(enquiry.email || '')}</span>
                    </div>
                    <div class="enquiry-card-meta">
                        <span class="enquiry-service-badge">${escapeHtml(enquiry.service || 'General')}</span>
                        <span class="enquiry-status ${enquiry.status || 'new'}">${(enquiry.status || 'new').charAt(0).toUpperCase() + (enquiry.status || 'new').slice(1)}</span>
                        <span class="enquiry-date">${formatDate(enquiry.createdAt)}</span>
                    </div>
                </div>
                <p class="enquiry-preview">${escapeHtml(enquiry.message || 'No message')}</p>
                <div class="enquiry-card-footer">
                    <span class="enquiry-phone"><i class="fas fa-phone"></i> ${escapeHtml(enquiry.phone || 'N/A')}</span>
                    <button class="btn btn-small btn-outline view-enquiry-btn" data-id="${enquiry.id}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            `;
            enquiriesList.appendChild(card);
        });

        // Add click handlers
        enquiriesList.querySelectorAll('.view-enquiry-btn').forEach(btn => {
            btn.addEventListener('click', () => openEnquiryDetail(btn.dataset.id));
        });
    }

    function openEnquiryDetail(id) {
        const enquiry = allEnquiries.find(e => e.id === id);
        if (!enquiry) return;

        currentEnquiryId = id;

        enquiryDetailContent.innerHTML = `
            <div class="detail-row">
                <label>Name</label>
                <span>${escapeHtml(enquiry.name || 'N/A')}</span>
            </div>
            <div class="detail-row">
                <label>Email</label>
                <span><a href="mailto:${escapeHtml(enquiry.email || '')}">${escapeHtml(enquiry.email || 'N/A')}</a></span>
            </div>
            <div class="detail-row">
                <label>Phone</label>
                <span><a href="tel:${escapeHtml(enquiry.phone || '')}">${escapeHtml(enquiry.phone || 'N/A')}</a></span>
            </div>
            <div class="detail-row">
                <label>Service</label>
                <span class="enquiry-service-badge">${escapeHtml(enquiry.service || 'General')}</span>
            </div>
            <div class="detail-row">
                <label>Date</label>
                <span>${formatDate(enquiry.createdAt)}</span>
            </div>
            <div class="detail-row full">
                <label>Message</label>
                <p class="detail-message">${escapeHtml(enquiry.message || 'No message')}</p>
            </div>
        `;

        enquiryModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // Mark as read / close enquiry modal
    enquiryModalCloseBtn.addEventListener('click', async () => {
        if (currentEnquiryId) {
            try {
                await db.collection('enquiries').doc(currentEnquiryId).update({ status: 'read' });
            } catch (error) {
                console.error('Error updating enquiry:', error);
            }
        }
        closeEnquiryModal();
    });

    // Delete enquiry
    enquiryDeleteBtn.addEventListener('click', async () => {
        if (currentEnquiryId && confirm('Are you sure you want to delete this enquiry?')) {
            try {
                await db.collection('enquiries').doc(currentEnquiryId).delete();
                showToast('Enquiry deleted', 'fas fa-check-circle');
                closeEnquiryModal();
            } catch (error) {
                showToast('Failed to delete enquiry', 'fas fa-exclamation-circle');
            }
        }
    });

    enquiryModalClose.addEventListener('click', closeEnquiryModal);
    enquiryModal.addEventListener('click', (e) => {
        if (e.target === enquiryModal) closeEnquiryModal();
    });

    function closeEnquiryModal() {
        enquiryModal.style.display = 'none';
        document.body.style.overflow = '';
        currentEnquiryId = null;
    }

    // Enquiry search & filter
    enquirySearch.addEventListener('input', renderEnquiries);
    enquiryFilter.addEventListener('change', renderEnquiries);

    // ============================================
    // DEVICES - Using compat API directly
    // ============================================

    function loadDevices() {
        db.collection('devices').orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                allDevices = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                updateDeviceStats();
                renderDevices();
            });
    }

    function updateDeviceStats() {
        totalDevicesEl.textContent = allDevices.length;
        activeDevicesEl.textContent = allDevices.filter(d => d.active !== false).length;
    }

    function renderDevices() {
        const search = deviceSearch.value.toLowerCase();
        const filter = deviceFilter.value;

        let filtered = allDevices.filter(d => {
            const matchesSearch = !search ||
                (d.name && d.name.toLowerCase().includes(search)) ||
                (d.brand && d.brand.toLowerCase().includes(search));
            const matchesFilter = filter === 'all' || d.category === filter;
            return matchesSearch && matchesFilter;
        });

        devicesTableBody.innerHTML = '';

        if (filtered.length === 0) {
            devicesEmpty.style.display = 'flex';
            devicesTable.style.display = 'none';
            return;
        }

        devicesEmpty.style.display = 'none';
        devicesTable.style.display = 'table';

        filtered.forEach(device => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="table-device">
                        <div class="table-device-img">
                            ${device.image
                                ? `<img src="${escapeHtml(device.image)}" alt="${escapeHtml(device.name)}">`
                                : '<i class="fas fa-mobile-screen-button"></i>'
                            }
                        </div>
                        <div>
                            <strong>${escapeHtml(device.name || 'Unnamed')}</strong>
                            <small>${escapeHtml(device.brand || '')}</small>
                        </div>
                    </div>
                </td>
                <td><span class="category-badge ${device.category || ''}">${capitalize(device.category || 'N/A')}</span></td>
                <td>
                    <span class="price-current">₹${Number(device.price || 0).toLocaleString('en-IN')}</span>
                    ${device.oldPrice ? `<span class="price-old">₹${Number(device.oldPrice).toLocaleString('en-IN')}</span>` : ''}
                </td>
                <td>
                    <small>${escapeHtml(device.processor || '-')}</small><br>
                    <small>${escapeHtml(device.storage || '-')}</small>
                </td>
                <td>${device.badge ? `<span class="badge-tag ${device.badge.toLowerCase()}">${escapeHtml(device.badge)}</span>` : '-'}</td>
                <td><span class="status-dot ${device.active !== false ? 'active' : 'inactive'}"></span>${device.active !== false ? 'Active' : 'Hidden'}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit-btn" data-id="${device.id}" title="Edit">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="action-btn toggle-btn" data-id="${device.id}" title="Toggle Visibility">
                            <i class="fas fa-${device.active !== false ? 'eye-slash' : 'eye'}"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${device.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            devicesTableBody.appendChild(tr);
        });

        // Event handlers
        devicesTableBody.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditDevice(btn.dataset.id));
        });

        devicesTableBody.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => toggleDeviceVisibility(btn.dataset.id));
        });

        devicesTableBody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteDevice(btn.dataset.id));
        });
    }

    // Device search & filter
    deviceSearch.addEventListener('input', renderDevices);
    deviceFilter.addEventListener('change', renderDevices);

    // Add device button
    addDeviceBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add New Device';
        deviceForm.reset();
        deviceEditId.value = '';
        document.getElementById('deviceActiveInput').checked = true;
        deviceModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Close device modal
    function closeDeviceModal() {
        deviceModal.style.display = 'none';
        document.body.style.overflow = '';
        deviceForm.reset();
        deviceEditId.value = '';
    }

    modalClose.addEventListener('click', closeDeviceModal);
    modalCancel.addEventListener('click', closeDeviceModal);
    deviceModal.addEventListener('click', (e) => {
        if (e.target === deviceModal) closeDeviceModal();
    });

    // Device form submit
    deviceForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            brand: document.getElementById('deviceBrandInput').value.trim(),
            name: document.getElementById('deviceNameInput').value.trim(),
            category: document.getElementById('deviceCategoryInput').value,
            badge: document.getElementById('deviceBadgeInput').value,
            price: Number(document.getElementById('devicePriceInput').value),
            oldPrice: Number(document.getElementById('deviceOldPriceInput').value) || null,
            processor: document.getElementById('deviceProcessorInput').value.trim(),
            storage: document.getElementById('deviceStorageInput').value.trim(),
            image: document.getElementById('deviceImageInput').value.trim(),
            active: document.getElementById('deviceActiveInput').checked
        };

        try {
            if (deviceEditId.value) {
                // Update existing
                await db.collection('devices').doc(deviceEditId.value).update(data);
                showToast('Device updated successfully!', 'fas fa-check-circle');
            } else {
                // Add new
                data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                await db.collection('devices').add(data);
                showToast('Device added successfully!', 'fas fa-check-circle');
            }
            closeDeviceModal();
        } catch (error) {
            console.error('Error saving device:', error);
            showToast('Failed to save device', 'fas fa-exclamation-circle');
        }
    });

    function openEditDevice(id) {
        const device = allDevices.find(d => d.id === id);
        if (!device) return;

        modalTitle.textContent = 'Edit Device';
        document.getElementById('deviceBrandInput').value = device.brand || '';
        document.getElementById('deviceNameInput').value = device.name || '';
        document.getElementById('deviceCategoryInput').value = device.category || '';
        document.getElementById('deviceBadgeInput').value = device.badge || '';
        document.getElementById('devicePriceInput').value = device.price || '';
        document.getElementById('deviceOldPriceInput').value = device.oldPrice || '';
        document.getElementById('deviceProcessorInput').value = device.processor || '';
        document.getElementById('deviceStorageInput').value = device.storage || '';
        document.getElementById('deviceImageInput').value = device.image || '';
        document.getElementById('deviceActiveInput').checked = device.active !== false;
        deviceEditId.value = id;

        deviceModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    async function toggleDeviceVisibility(id) {
        const device = allDevices.find(d => d.id === id);
        if (!device) return;

        try {
            await db.collection('devices').doc(id).update({ active: !device.active });
            showToast(device.active ? 'Device hidden' : 'Device now visible', 'fas fa-check-circle');
        } catch (error) {
            showToast('Failed to update device', 'fas fa-exclamation-circle');
        }
    }

    async function deleteDevice(id) {
        if (!confirm('Are you sure you want to delete this device?')) return;

        try {
            await db.collection('devices').doc(id).delete();
            showToast('Device deleted', 'fas fa-check-circle');
        } catch (error) {
            showToast('Failed to delete device', 'fas fa-exclamation-circle');
        }
    }

    // ============================================
    // SEED DEMO DATA
    // ============================================

    seedDataBtn.addEventListener('click', async () => {
        if (!confirm('This will add sample devices to your Firestore database. Continue?')) return;

        seedDataBtn.disabled = true;
        seedDataBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Loading...</span>';

        const demoDevices = [
            {
                brand: 'Apple', name: 'iPhone 15 Pro Max', category: 'flagship', badge: 'New',
                price: 129999, oldPrice: 139999, processor: 'A17 Pro', storage: '256GB',
                image: '', active: true, createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                brand: 'Samsung', name: 'Galaxy S24 Ultra', category: 'flagship', badge: 'Sale',
                price: 119999, oldPrice: 134999, processor: 'Snapdragon 8 Gen 3', storage: '512GB',
                image: '', active: true, createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                brand: 'OnePlus', name: 'OnePlus 12', category: 'midrange', badge: '',
                price: 64999, oldPrice: 69999, processor: 'Snapdragon 8 Gen 3', storage: '256GB',
                image: '', active: true, createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                brand: 'Xiaomi', name: 'Redmi Note 13 Pro+', category: 'midrange', badge: 'New',
                price: 32999, oldPrice: 35999, processor: 'Dimensity 7200', storage: '256GB',
                image: '', active: true, createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                brand: 'Realme', name: 'Realme Narzo 70x', category: 'budget', badge: '',
                price: 14999, oldPrice: 16999, processor: 'Dimensity 6300', storage: '128GB',
                image: '', active: true, createdAt: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                brand: 'Apple', name: 'iPhone 14 Pro', category: 'refurbished', badge: 'Refurbished',
                price: 54999, oldPrice: 79999, processor: 'A16 Bionic', storage: '128GB',
                image: '', active: true, createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }
        ];

        try {
            for (const device of demoDevices) {
                await db.collection('devices').add(device);
            }
            showToast('Demo devices added successfully!', 'fas fa-check-circle');
        } catch (error) {
            console.error('Error seeding data:', error);
            showToast('Failed to add demo data', 'fas fa-exclamation-circle');
        }

        seedDataBtn.disabled = false;
        seedDataBtn.innerHTML = '<i class="fas fa-seedling"></i><span>Load Demo Devices</span>';
    });

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatDate(timestamp) {
        if (!timestamp) return 'Just now';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            const now = new Date();
            const diffMs = now - date;
            const diffMin = Math.floor(diffMs / 60000);
            const diffHr = Math.floor(diffMs / 3600000);
            const diffDay = Math.floor(diffMs / 86400000);

            if (diffMin < 1) return 'Just now';
            if (diffMin < 60) return diffMin + 'm ago';
            if (diffHr < 24) return diffHr + 'h ago';
            if (diffDay < 7) return diffDay + 'd ago';

            return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) {
            return 'Unknown';
        }
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function showToast(message, icon) {
        icon = icon || 'fas fa-info-circle';
        var container = document.getElementById('toastContainer') || document.body;
        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = '<i class="' + icon + '"></i><span>' + message + '</span>';
        container.appendChild(toast);

        requestAnimationFrame(function () {
            toast.classList.add('show');
        });

        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 300);
        }, 3500);
    }

})();