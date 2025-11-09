/*
 * 🚗 Queue — Customer Service System (Bank or Help Desk)
 * 
 * Real-world analogy:
 * Banks, ticket counters, call centers, and restaurant ordering systems use queues 
 * for fair service distribution. First-come, first-served principle ensures equity.
 * 
 * Time Complexity:
 * - Enqueue (join queue): O(1)
 * - Dequeue (serve customer): O(1)
 * - Display queue: O(n)
 * Space Complexity: O(n) where n is number of customers
 */

#include <iostream>
#include <queue>
#include <string>
#include <chrono>
#include <iomanip>
#include <vector>
#include <random>
using namespace std;
using namespace std::chrono;

struct Customer {
    string name;
    int token;
    string serviceType;
    string arrivalTime;
    int priority; // 1=VIP, 2=Premium, 3=Regular
    
    Customer(string n, int t, string service, int prio = 3) 
        : name(n), token(t), serviceType(service), priority(prio) {
        auto now = high_resolution_clock::now();
        auto ms = duration_cast<milliseconds>(now.time_since_epoch());
        arrivalTime = to_string(ms.count() % 100000);
    }
};

class BankServiceSystem {
private:
    queue<Customer> regularQueue;
    queue<Customer> vipQueue;
    queue<Customer> premiumQueue;
    int nextToken;
    int totalCustomersServed;
    int totalWaitTime;
    vector<string> serviceLog;
    
public:
    BankServiceSystem() : nextToken(1), totalCustomersServed(0), totalWaitTime(0) {
        cout << "=== 🏦 Bank Customer Service System ===\n\n";
        cout << "🎫 Service System Initialized\n";
        cout << "📋 Available Services: Account Opening, Loan Application, \n";
        cout << "    Money Transfer, Balance Inquiry, Card Services\n\n";
    }

    void addCustomer(const string& name, const string& service, int priority = 3) {
        Customer newCustomer(name, nextToken++, service, priority);
        
        // Add to appropriate queue based on priority
        switch(priority) {
            case 1: // VIP
                vipQueue.push(newCustomer);
                cout << "🌟 VIP Customer " << name << " joined queue (Token #" 
                     << newCustomer.token << " - " << service << ")\n";
                break;
            case 2: // Premium
                premiumQueue.push(newCustomer);
                cout << "💎 Premium Customer " << name << " joined queue (Token #" 
                     << newCustomer.token << " - " << service << ")\n";
                break;
            default: // Regular
                regularQueue.push(newCustomer);
                cout << "👤 Regular Customer " << name << " joined queue (Token #" 
                     << newCustomer.token << " - " << service << ")\n";
                break;
        }
        
        serviceLog.push_back("JOINED: " + name + " (Token #" + to_string(newCustomer.token) + ")");
        displayQueueSizes();
    }

    void serveNextCustomer() {
        Customer* customerToServe = nullptr;
        string queueType;
        
        // Priority: VIP → Premium → Regular
        if (!vipQueue.empty()) {
            customerToServe = new Customer(vipQueue.front());
            vipQueue.pop();
            queueType = "VIP";
        } else if (!premiumQueue.empty()) {
            customerToServe = new Customer(premiumQueue.front());
            premiumQueue.pop();
            queueType = "Premium";
        } else if (!regularQueue.empty()) {
            customerToServe = new Customer(regularQueue.front());
            regularQueue.pop();
            queueType = "Regular";
        } else {
            cout << "❌ No customers to serve! All queues are empty.\n";
            return;
        }
        
        totalCustomersServed++;
        
        // Simulate service time
        int serviceTime = simulateServiceTime(customerToServe->serviceType);
        
        cout << "🔔 Now Serving: " << customerToServe->name 
             << " (Token #" << customerToServe->token << ")\n";
        cout << "   📝 Service: " << customerToServe->serviceType << "\n";
        cout << "   ⭐ Queue Type: " << queueType << "\n";
        cout << "   ⏱️ Estimated Service Time: " << serviceTime << " minutes\n";
        
        serviceLog.push_back("SERVED: " + customerToServe->name + " (" + 
                           customerToServe->serviceType + ") - " + to_string(serviceTime) + "min");
        
        delete customerToServe;
        displayQueueSizes();
    }

    void displayAllQueues() {
        cout << "\n📊 Current Queue Status:\n";
        cout << "╔══════════════════════════════════════════════════════════════╗\n";
        cout << "║                         QUEUE OVERVIEW                       ║\n";
        cout << "╠══════════════════════════════════════════════════════════════╣\n";
        
        // Display VIP Queue
        cout << "║ 🌟 VIP Queue (" << vipQueue.size() << " customers)";
        cout << string(41 - to_string(vipQueue.size()).length(), ' ') << "║\n";
        
        if (!vipQueue.empty()) {
            queue<Customer> temp = vipQueue;
            int position = 1;
            while (!temp.empty() && position <= 3) {  // Show first 3
                Customer c = temp.front();
                temp.pop();
                cout << "║   " << position << ". " << left << setw(15) << c.name 
                     << "│ Token #" << setw(3) << c.token 
                     << "│ " << left << setw(15) << c.serviceType << "║\n";
                position++;
            }
            if (vipQueue.size() > 3) {
                cout << "║   ... and " << (vipQueue.size() - 3) << " more";
                cout << string(40, ' ') << "║\n";
            }
        } else {
            cout << "║   (Empty)                                                    ║\n";
        }
        
        cout << "╠══════════════════════════════════════════════════════════════╣\n";
        
        // Display Premium Queue
        cout << "║ 💎 Premium Queue (" << premiumQueue.size() << " customers)";
        cout << string(37 - to_string(premiumQueue.size()).length(), ' ') << "║\n";
        
        if (!premiumQueue.empty()) {
            queue<Customer> temp = premiumQueue;
            int position = 1;
            while (!temp.empty() && position <= 3) {
                Customer c = temp.front();
                temp.pop();
                cout << "║   " << position << ". " << left << setw(15) << c.name 
                     << "│ Token #" << setw(3) << c.token 
                     << "│ " << left << setw(15) << c.serviceType << "║\n";
                position++;
            }
            if (premiumQueue.size() > 3) {
                cout << "║   ... and " << (premiumQueue.size() - 3) << " more";
                cout << string(40, ' ') << "║\n";
            }
        } else {
            cout << "║   (Empty)                                                    ║\n";
        }
        
        cout << "╠══════════════════════════════════════════════════════════════╣\n";
        
        // Display Regular Queue
        cout << "║ 👤 Regular Queue (" << regularQueue.size() << " customers)";
        cout << string(37 - to_string(regularQueue.size()).length(), ' ') << "║\n";
        
        if (!regularQueue.empty()) {
            queue<Customer> temp = regularQueue;
            int position = 1;
            while (!temp.empty() && position <= 3) {
                Customer c = temp.front();
                temp.pop();
                cout << "║   " << position << ". " << left << setw(15) << c.name 
                     << "│ Token #" << setw(3) << c.token 
                     << "│ " << left << setw(15) << c.serviceType << "║\n";
                position++;
            }
            if (regularQueue.size() > 3) {
                cout << "║   ... and " << (regularQueue.size() - 3) << " more";
                cout << string(40, ' ') << "║\n";
            }
        } else {
            cout << "║   (Empty)                                                    ║\n";
        }
        
        cout << "╚══════════════════════════════════════════════════════════════╝\n\n";
    }

    void displayQueueSizes() {
        int totalCustomers = vipQueue.size() + premiumQueue.size() + regularQueue.size();
        cout << "📈 Queue Sizes: VIP(" << vipQueue.size() << ") | Premium(" 
             << premiumQueue.size() << ") | Regular(" << regularQueue.size() 
             << ") | Total: " << totalCustomers << "\n";
        cout << "────────────────────────────────────────────────────────\n";
    }

    void showServiceLog() {
        cout << "\n📜 Service Activity Log:\n";
        cout << "┌────┬────────────────────────────────────────────────────────┐\n";
        cout << "│ #  │ Activity                                               │\n";
        cout << "├────┼────────────────────────────────────────────────────────┤\n";
        
        for (size_t i = 0; i < serviceLog.size(); i++) {
            cout << "│ " << left << setw(2) << (i + 1) << " │ " 
                 << left << setw(54) << serviceLog[i] << "│\n";
        }
        cout << "└────┴────────────────────────────────────────────────────────┘\n";
    }

    void showStatistics() {
        int totalInQueue = vipQueue.size() + premiumQueue.size() + regularQueue.size();
        
        cout << "\n📊 Bank Service Statistics:\n";
        cout << "├── Total Customers Served: " << totalCustomersServed << endl;
        cout << "├── Currently in Queue: " << totalInQueue << endl;
        cout << "├── Next Token Number: " << nextToken << endl;
        cout << "├── VIP Customers Waiting: " << vipQueue.size() << endl;
        cout << "├── Premium Customers Waiting: " << premiumQueue.size() << endl;
        cout << "├── Regular Customers Waiting: " << regularQueue.size() << endl;
        cout << "└── Service Efficiency: " << fixed << setprecision(1) 
             << (totalCustomersServed > 0 ? (float)totalCustomersServed / (totalCustomersServed + totalInQueue) * 100 : 0) << "%" << endl;
    }

    void demonstrateQueueConcepts() {
        cout << "\n🎯 Queue Concepts Demonstrated:\n";
        cout << "• 🚶‍♂️ FIFO (First-In-First-Out) - fairness in service order\n";
        cout << "• 🏆 Priority Queues - VIP, Premium, Regular service levels\n";
        cout << "• ⚡ O(1) Enqueue/Dequeue - constant time operations\n";
        cout << "• 📊 Queue Management - multiple queue handling\n";
        cout << "• 🎫 Token System - systematic customer identification\n\n";
        
        cout << "🌍 Real-world Applications:\n";
        cout << "• Banking Systems (teller services, loan processing)\n";
        cout << "• Call Centers (customer support, technical help)\n";
        cout << "• Restaurant Ordering (drive-through, food courts)\n";
        cout << "• Operating Systems (process scheduling, print queues)\n";
        cout << "• Network Systems (packet routing, load balancing)\n";
        cout << "• Theme Parks (ride queues, fast-pass systems)\n";
        cout << "• Hospital Systems (emergency triage, appointment scheduling)\n";
    }

private:
    int simulateServiceTime(const string& serviceType) {
        // Simulate different service times based on service type
        if (serviceType == "Balance Inquiry") return 2;
        if (serviceType == "Money Transfer") return 5;
        if (serviceType == "Account Opening") return 15;
        if (serviceType == "Loan Application") return 25;
        if (serviceType == "Card Services") return 8;
        return 5; // Default
    }
};

int main() {
    BankServiceSystem bank;
    
    cout << "🏦 Starting Bank Service Simulation:\n\n";
    
    // Add regular customers
    bank.addCustomer("Alice Johnson", "Account Opening");
    bank.addCustomer("Bob Smith", "Balance Inquiry");
    bank.addCustomer("Charlie Brown", "Money Transfer");
    
    // Add premium customers  
    bank.addCustomer("Diana Prince", "Loan Application", 2);  // Premium
    bank.addCustomer("Eve Wilson", "Card Services", 2);       // Premium
    
    // Add VIP customers
    bank.addCustomer("Frank Castle", "Account Opening", 1);   // VIP
    bank.addCustomer("Grace Lee", "Money Transfer", 1);       // VIP
    
    // Add more regular customers
    bank.addCustomer("Henry Ford", "Balance Inquiry");
    bank.addCustomer("Ivy Chen", "Card Services");
    
    cout << "\n📋 Initial Queue Setup Complete:\n";
    bank.displayAllQueues();
    
    cout << "🔔 Starting Service (Priority: VIP → Premium → Regular):\n\n";
    
    // Serve customers - should prioritize VIP first
    for (int i = 0; i < 5; i++) {
        bank.serveNextCustomer();
        cout << endl;
    }
    
    cout << "📊 Current Status After 5 Services:\n";
    bank.displayAllQueues();
    
    // Add some more customers while serving
    cout << "🚶‍♂️ More customers arriving:\n";
    bank.addCustomer("Jack Ryan", "Balance Inquiry", 1);      // VIP
    bank.addCustomer("Kate Bishop", "Loan Application");      // Regular
    bank.addCustomer("Leo Stark", "Card Services", 2);       // Premium
    
    cout << "\n🔔 Continuing service:\n";
    
    // Serve remaining customers
    while (true) {
        // Check if any queues have customers
        bool hasCustomers = false;
        
        // We need to check if queues are empty in a way that doesn't modify them
        BankServiceSystem tempBank;  // This is a workaround for checking
        
        cout << "\n📊 Final queue status:\n";
        bank.displayAllQueues();
        
        // Serve a few more
        bank.serveNextCustomer();
        bank.serveNextCustomer();
        bank.serveNextCustomer();
        
        break;  // Exit after serving a few more for demo
    }
    
    // Show comprehensive information
    bank.showServiceLog();
    bank.showStatistics();
    bank.demonstrateQueueConcepts();
    
    cout << "\nPress any key to continue...";
    cin.get();
    
    return 0;
}