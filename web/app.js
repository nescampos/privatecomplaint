// Global variables to store app state
let appInitialized = false;

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Initializing Compliants Web App...');
    await initializeApp();
    updateDashboard();
});

// Show a specific section and hide others
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active-section');
    });
    document.getElementById(sectionId).classList.add('active-section');
}

// Loading state functions
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Initialize the app by checking backend connection
async function initializeApp() {
    try {
        showLoading();
        
        // Check if backend API is available
        const statusResponse = await fetch('/api/status');
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'ok') {
            appInitialized = true;
            console.log('App connected to backend service');
        } else {
            console.error('Backend service not responding properly');
            alert('Warning: Backend service not responding properly. Some features may not work.');
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error connecting to backend:', error);
        hideLoading();
        alert('Error connecting to backend service: ' + error.message);
    }
}

// Update dashboard with current data
async function updateDashboard() {
    try {
        if (!appInitialized) {
            console.log('App not initialized, using mock data');
            document.getElementById('total-reports').textContent = '0';
            document.getElementById('open-reports').textContent = '0';
            document.getElementById('closed-reports').textContent = '0';
            document.getElementById('pending-feedback').textContent = '0';
            document.getElementById('wallet-address').textContent = 'Not connected';
            document.getElementById('balance').textContent = '0 DUST';
            return;
        }
        
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        document.getElementById('total-reports').textContent = data.totalReports;
        document.getElementById('open-reports').textContent = data.openReports;
        document.getElementById('closed-reports').textContent = data.closedReports;
        document.getElementById('pending-feedback').textContent = data.pendingFeedback;
        document.getElementById('wallet-address').textContent = data.walletAddress;
        document.getElementById('balance').textContent = data.balance + ' DUST';
        
        console.log('Dashboard updated with live data');
    } catch (error) {
        console.error('Error updating dashboard:', error);
        // Use mock values if API fails
        document.getElementById('total-reports').textContent = '0';
        document.getElementById('open-reports').textContent = '0';
        document.getElementById('closed-reports').textContent = '0';
        document.getElementById('pending-feedback').textContent = '0';
        document.getElementById('wallet-address').textContent = 'Error loading';
        document.getElementById('balance').textContent = 'Error loading';
    }
}

// Submit a new report
async function submitReport(event) {
    event.preventDefault();
    
    try {
        showLoading();
        
        const institutionName = document.getElementById('institution-name').value;
        const institutionType = document.getElementById('institution-type').value;
        const reportDetails = document.getElementById('report-details').value;
        const timestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp
        
        // Validate inputs
        if (!institutionName || !institutionType || !reportDetails) {
            alert('Please fill in all required fields');
            hideLoading();
            return;
        }
        
        const response = await fetch('/api/reports/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                institution_name: institutionName,
                report_details: reportDetails,
                institution_type: institutionType,
                timestamp: timestamp
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(`Report submitted successfully!\nTransaction ID: ${result.transactionId}`);
            document.getElementById('report-form').reset();
        } else {
            throw new Error(result.error || 'Unknown error');
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error submitting report:', error);
        hideLoading();
        alert('Error submitting report: ' + error.message);
    }
}

// Refresh the reports list
async function refreshReports() {
    try {
        showLoading();
        
        const response = await fetch('/api/reports');
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        const reportsContainer = document.getElementById('reports-list');
        
        if (data.reports.length === 0) {
            reportsContainer.innerHTML = '<p class="text-muted">No reports available</p>';
        } else {
            let reportsHtml = '<div class="row">';
            data.reports.forEach(report => {
                reportsHtml += `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card report-card">
                        <div class="card-body">
                            <h6 class="card-title">Report #${report.report_id}</h6>
                            <p class="card-text"><strong>Institution:</strong> ${report.institution_name}</p>
                            <p class="card-text"><strong>Type:</strong> ${report.institution_type}</p>
                            <p class="card-text"><small class="text-muted">${new Date(report.timestamp * 1000).toLocaleString()}</small></p>
                        </div>
                    </div>
                </div>`;
            });
            reportsHtml += '</div>';
            reportsContainer.innerHTML = reportsHtml;
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error refreshing reports:', error);
        hideLoading();
        document.getElementById('reports-list').innerHTML = '<p class="text-danger">Error loading reports: ' + error.message + '</p>';
    }
}

// Contralor functions - these would require contralor credentials
async function getViewReport() {
    try {
        showLoading();
        
        const reportId = document.getElementById('report-id-control').value;
        
        if (!reportId) {
            alert('Please provide a report ID');
            hideLoading();
            return;
        }
        
        const response = await fetch(`/api/contralor/report/${reportId}`);
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        const report = result.report;
        
        document.getElementById('report-details-content').innerHTML = `
            <h6>Report #${report.report_id}</h6>
            <p><strong>Institution:</strong> ${report.institution_name}</p>
            <p><strong>Type:</strong> ${report.institution_type}</p>
            <p><strong>Details:</strong> ${report.report_details}</p>
            <p><strong>Timestamp:</strong> ${new Date(report.timestamp * 1000).toLocaleString()}</p>
            <p><strong>Informer:</strong> ${report.informer}</p>
        `;
        document.getElementById('report-details-container').style.display = 'block';
        
        hideLoading();
    } catch (error) {
        console.error('Error getting report:', error);
        hideLoading();
        alert('Error getting report: ' + error.message);
    }
}

async function updateCaseStatus() {
    try {
        showLoading();
        
        const reportId = document.getElementById('report-id-control').value;
        
        if (!reportId) {
            alert('Please provide a report ID');
            hideLoading();
            return;
        }
        
        // Get new status from user
        const newStatus = prompt('Enter new case status:', 'Under Review');
        if (!newStatus) {
            hideLoading();
            return;
        }
        
        const response = await fetch('/api/contralor/update-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                report_id: parseInt(reportId),
                new_status: newStatus
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(`Case status updated successfully!\nTransaction ID: ${result.transactionId}`);
        } else {
            throw new Error(result.error || 'Unknown error');
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error updating case status:', error);
        hideLoading();
        alert('Error updating case status: ' + error.message);
    }
}

async function sendFeedback() {
    try {
        showLoading();
        
        const reportId = document.getElementById('report-id-control').value;
        
        if (!reportId) {
            alert('Please provide a report ID');
            hideLoading();
            return;
        }
        
        // Get feedback message from user
        const feedbackMessage = prompt('Enter feedback message for the reporter:');
        if (!feedbackMessage) {
            hideLoading();
            return;
        }
        
        const response = await fetch('/api/contralor/send-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                report_id: parseInt(reportId),
                feedback_message: feedbackMessage
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert(`Feedback sent successfully!\nTransaction ID: ${result.transactionId}`);
        } else {
            throw new Error(result.error || 'Unknown error');
        }
        
        hideLoading();
    } catch (error) {
        console.error('Error sending feedback:', error);
        hideLoading();
        alert('Error sending feedback: ' + error.message);
    }
}

// Form utility functions
function clearForm(formId) {
    document.getElementById(formId).reset();
}

// Set up event listeners
document.getElementById('report-form').addEventListener('submit', submitReport);