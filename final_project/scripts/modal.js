// Modal management functionality
class ModalManager {
    constructor() {
        this.modals = new Map();
        this.init();
    }

    init() {
        // Setup global modal event listeners
        this.setupGlobalModalEvents();
    }

    // Register a modal
    registerModal(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.warn(`Modal with id '${modalId}' not found`);
            return null;
        }

        const modalConfig = {
            modal,
            closeButton: modal.querySelector('.close-btn'),
            backdropClose: options.backdropClose !== false,
            escapeClose: options.escapeClose !== false,
            ...options
        };

        this.setupModalEvents(modalConfig);
        this.modals.set(modalId, modalConfig);

        return modalConfig;
    }

    // Setup events for a specific modal
    setupModalEvents(modalConfig) {
        const { modal, closeButton, backdropClose, escapeClose } = modalConfig;

        // Close button
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeModal(modal));
        }

        // Backdrop click
        if (backdropClose) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        }

        // Escape key
        if (escapeClose) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.open) {
                    this.closeModal(modal);
                }
            });
        }
    }

    // Setup global modal events
    setupGlobalModalEvents() {
        // Prevent event propagation for modal content
        document.addEventListener('click', (e) => {
            if (e.target.closest('.modal-content')) {
                e.stopPropagation();
            }
        });
    }

    // Open modal
    openModal(modalId, content = null) {
        const modalConfig = this.modals.get(modalId);
        if (!modalConfig) {
            console.warn(`Modal '${modalId}' not registered`);
            return false;
        }

        const { modal } = modalConfig;

        // Set content if provided
        if (content && modalConfig.contentContainer) {
            modalConfig.contentContainer.innerHTML = content;
        }

        modal.showModal();
        
        // Add opening animation
        modal.classList.add('modal-opening');
        setTimeout(() => {
            modal.classList.remove('modal-opening');
        }, 300);

        return true;
    }

    // Close modal
    closeModal(modal) {
        if (modal && modal.open) {
            // Add closing animation
            modal.classList.add('modal-closing');
            
            setTimeout(() => {
                modal.close();
                modal.classList.remove('modal-closing');
                
                // Clear content if needed
                const modalConfig = Array.from(this.modals.values())
                    .find(config => config.modal === modal);
                
                if (modalConfig && modalConfig.autoClear) {
                    modalConfig.contentContainer.innerHTML = '';
                }
            }, 300);
        }
    }

    // Close all modals
    closeAllModals() {
        this.modals.forEach(({ modal }) => {
            this.closeModal(modal);
        });
    }

    // Update modal content
    updateModalContent(modalId, content) {
        const modalConfig = this.modals.get(modalId);
        if (modalConfig && modalConfig.contentContainer) {
            modalConfig.contentContainer.innerHTML = content;
        }
    }

    // Create dynamic modal
    createDynamicModal(content, options = {}) {
        const modalId = `dynamic-modal-${Date.now()}`;
        
        const modalHTML = `
            <dialog id="${modalId}" class="modal">
                <div class="modal-content">
                    <button class="close-btn" aria-label="Close modal">×</button>
                    <div class="modal-body">${content}</div>
                </div>
            </dialog>
        `;

        // Add to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Register the modal
        const modalConfig = this.registerModal(modalId, {
            contentContainer: document.querySelector(`#${modalId} .modal-body`),
            ...options
        });

        return modalId;
    }

    // Show confirmation modal
    showConfirmation(message, confirmCallback, cancelCallback = null) {
        const content = `
            <div class="confirmation-modal">
                <h3>Confirm Action</h3>
                <p>${message}</p>
                <div class="confirmation-actions">
                    <button class="btn-confirm">Yes, Continue</button>
                    <button class="btn-cancel">Cancel</button>
                </div>
            </div>
        `;

        const modalId = this.createDynamicModal(content);

        // Setup event listeners
        setTimeout(() => {
            const confirmBtn = document.querySelector(`#${modalId} .btn-confirm`);
            const cancelBtn = document.querySelector(`#${modalId} .btn-cancel`);

            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => {
                    if (confirmCallback) confirmCallback();
                    this.closeModal(document.getElementById(modalId));
                });
            }

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    if (cancelCallback) cancelCallback();
                    this.closeModal(document.getElementById(modalId));
                });
            }
        }, 0);

        this.openModal(modalId);
        return modalId;
    }
}

// Create singleton instance
const modalManager = new ModalManager();

export default modalManager;
