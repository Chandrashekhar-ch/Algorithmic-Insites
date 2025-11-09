/*
 * # Hash Tables - Employee Database Management System
 * 
 * Real-world analogy:
 * Companies use hash tables for rapid employee data access, database indexing,
 * caching systems, and password storage. Hash tables power many real-world
 * applications requiring O(1) average-case lookup time.
 * 
 * Time Complexity:
 * - Insert: O(1) average, O(n) worst case (poor hash function/many collisions)
 * - Search: O(1) average, O(n) worst case
 * - Delete: O(1) average, O(n) worst case
 * Space Complexity: O(n)
 */

#include <iostream>
#include <string>
#include <list>
#include <vector>
#include <chrono>
#include <iomanip>
#include <algorithm>
#include <random>
using namespace std;
using namespace std::chrono;

struct Employee {
    int empID;
    string name;
    string department;
    string position;
    double salary;
    string email;
    string phoneNumber;
    
    Employee(int id = 0, string n = "", string dept = "", string pos = "", 
             double sal = 0.0, string em = "", string phone = "") 
        : empID(id), name(n), department(dept), position(pos), 
          salary(sal), email(em), phoneNumber(phone) {}
    
    void display() const {
        cout << "| " << left << setw(6) << empID 
             << "| " << left << setw(15) << name 
             << "| " << left << setw(12) << department
             << "| " << left << setw(18) << position
             << "| $" << right << setw(8) << fixed << setprecision(0) << salary
             << "|" << endl;
    }
};

class EmployeeHashTable {
private:
    static const int DEFAULT_SIZE = 17; // Prime number for better distribution
    int tableSize;
    vector<list<Employee>> table;
    int totalElements;
    int collisions;
    
    // Primary hash function (Division method)
    int hashFunction1(int key) const {
        return key % tableSize;
    }
    
    // Secondary hash function for double hashing
    int hashFunction2(int key) const {
        return 7 - (key % 7); // Another prime number
    }
    
    // Calculate load factor
    double getLoadFactor() const {
        return (double)totalElements / tableSize;
    }
    
    // Rehashing when load factor exceeds threshold
    void rehash() {
        cout << ">> Rehashing table (load factor exceeded 0.75)...\n";
        
        vector<list<Employee>> oldTable = table;
        int oldSize = tableSize;
        
        // Double the size and find next prime
        tableSize = getNextPrime(tableSize * 2);
        table.assign(tableSize, list<Employee>());
        totalElements = 0;
        collisions = 0;
        
        // Reinsert all elements
        for (int i = 0; i < oldSize; i++) {
            for (const Employee& emp : oldTable[i]) {
                insertEmployee(emp.empID, emp.name, emp.department, 
                             emp.position, emp.salary, emp.email, emp.phoneNumber);
            }
        }
        
        cout << "[+] Rehashing complete. New table size: " << tableSize << endl;
    }
    
    // Find next prime number
    int getNextPrime(int n) const {
        while (!isPrime(n)) n++;
        return n;
    }
    
    // Check if number is prime
    bool isPrime(int n) const {
        if (n < 2) return false;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

public:
    EmployeeHashTable(int size = DEFAULT_SIZE) : tableSize(getNextPrime(size)), totalElements(0), collisions(0) {
        table.resize(tableSize);
    }
    
    // Insert employee record
    void insertEmployee(int empID, string name, string department = "", 
                       string position = "", double salary = 0.0, 
                       string email = "", string phoneNumber = "") {
        
        // Check if rehashing is needed
        if (getLoadFactor() > 0.75) {
            rehash();
        }
        
        int index = hashFunction1(empID);
        int originalIndex = index;
        bool collision = false;
        
        // Check if slot is occupied (for collision counting)
        if (!table[index].empty()) {
            // Check if ID already exists
            for (const Employee& emp : table[index]) {
                if (emp.empID == empID) {
                    cout << "[!] Employee ID " << empID << " already exists. Update not performed.\n";
                    return;
                }
            }
            collisions++;
            collision = true;
        }
        
        // Insert using chaining
        table[index].push_back(Employee(empID, name, department, position, salary, email, phoneNumber));
        totalElements++;
        
        if (collision) {
            cout << "[!] Collision detected for ID " << empID << " at index " << index << endl;
        }
    }
    
    // Search for employee by ID
    Employee* searchEmployee(int empID, int& comparisons) {
        comparisons = 0;
        int index = hashFunction1(empID);
        
        for (Employee& emp : table[index]) {
            comparisons++;
            if (emp.empID == empID) {
                return &emp;
            }
        }
        
        return nullptr;
    }
    
    // Delete employee record
    bool deleteEmployee(int empID) {
        int index = hashFunction1(empID);
        
        for (auto it = table[index].begin(); it != table[index].end(); ++it) {
            if (it->empID == empID) {
                cout << "[-] Deleted Employee: " << it->name << " (ID: " << empID << ")" << endl;
                table[index].erase(it);
                totalElements--;
                return true;
            }
        }
        
        cout << "[x] Employee ID " << empID << " not found for deletion\n";
        return false;
    }
    
    // Display entire hash table
    void displayTable() const {
        cout << "\n>> Employee Database (Hash Table Structure):\n";
        cout << "+-------+-------------------------------------------------------------------------+\n";
        cout << "| Index | Employees (Chain)                                                   |\n";
        cout << "+-------+-------------------------------------------------------------------------+\n";
        
        for (int i = 0; i < tableSize; i++) {
            cout << "| " << right << setw(5) << i << " | ";
            
            if (table[i].empty()) {
                cout << left << setw(67) << "Empty" << "|" << endl;
            } else {
                bool first = true;
                for (const Employee& emp : table[i]) {
                    if (!first) {
                        cout << "|       | ";
                    }
                    cout << "[ID:" << emp.empID << " " << emp.name << "]";
                    if (table[i].size() > 1) cout << " -> ";
                    first = false;
                }
                cout << endl;
            }
        }
        cout << "+-------+-------------------------------------------------------------------------+\n";
    }
    
    // Display all employees in a formatted table
    void displayAllEmployees() const {
        cout << "\n>> Employee Directory:\n";
        cout << "+--------+-----------------+--------------+--------------------+-----------+\n";
        cout << "| Emp ID | Name            | Department   | Position           | Salary    |\n";
        cout << "+--------+-----------------+--------------+--------------------+-----------+\n";
        
        for (int i = 0; i < tableSize; i++) {
            for (const Employee& emp : table[i]) {
                emp.display();
            }
        }
        cout << "+--------+-----------------+--------------+--------------------+-----------+\n";
    }
    
    // Search employees by department
    vector<Employee> searchByDepartment(const string& department) const {
        vector<Employee> result;
        
        for (int i = 0; i < tableSize; i++) {
            for (const Employee& emp : table[i]) {
                if (emp.department == department) {
                    result.push_back(emp);
                }
            }
        }
        
        return result;
    }
    
    // Calculate salary statistics
    void calculateSalaryStats() const {
        if (totalElements == 0) {
            cout << ">> No employees in database\n";
            return;
        }
        
        double totalSalary = 0;
        double minSalary = 1e9;
        double maxSalary = 0;
        string highestPaid, lowestPaid;
        
        for (int i = 0; i < tableSize; i++) {
            for (const Employee& emp : table[i]) {
                totalSalary += emp.salary;
                if (emp.salary > maxSalary) {
                    maxSalary = emp.salary;
                    highestPaid = emp.name;
                }
                if (emp.salary < minSalary) {
                    minSalary = emp.salary;
                    lowestPaid = emp.name;
                }
            }
        }
        
        cout << "\n>> Salary Statistics:\n";
        cout << "+-- Average Salary: $" << fixed << setprecision(0) << totalSalary / totalElements << endl;
        cout << "+-- Highest Paid: " << highestPaid << " ($" << maxSalary << ")" << endl;
        cout << "+-- Lowest Paid: " << lowestPaid << " ($" << minSalary << ")" << endl;
        cout << "+-- Total Payroll: $" << totalSalary << endl;
    }
    
    // Performance analysis
    void analyzePerformance() const {
        cout << "\n[!] Hash Table Performance Analysis:\n";
        cout << "+-- Table Size: " << tableSize << endl;
        cout << "+-- Total Elements: " << totalElements << endl;
        cout << "+-- Load Factor: " << fixed << setprecision(3) << getLoadFactor() << endl;
        cout << "+-- Total Collisions: " << collisions << endl;
        
        // Calculate chain lengths
        int maxChainLength = 0;
        int nonEmptyBuckets = 0;
        double avgChainLength = 0;
        
        for (int i = 0; i < tableSize; i++) {
            int chainLength = table[i].size();
            if (chainLength > 0) {
                nonEmptyBuckets++;
                avgChainLength += chainLength;
            }
            maxChainLength = max(maxChainLength, chainLength);
        }
        
        if (nonEmptyBuckets > 0) {
            avgChainLength /= nonEmptyBuckets;
        }
        
        cout << "+-- Non-empty Buckets: " << nonEmptyBuckets << "/" << tableSize 
             << " (" << fixed << setprecision(1) << (100.0 * nonEmptyBuckets / tableSize) << "%)" << endl;
        cout << "+-- Average Chain Length: " << fixed << setprecision(2) << avgChainLength << endl;
        cout << "+-- Maximum Chain Length: " << maxChainLength << endl;
        cout << "+-- Hash Distribution Quality: " 
             << (maxChainLength <= 3 && getLoadFactor() < 0.8 ? "Good [+]" : "Needs Improvement [!]") << endl;
    }
    
    // Benchmark search performance
    void benchmarkSearch(const vector<int>& searchIDs) {
        cout << "\n>> Search Performance Benchmark:\n";
        
        int totalComparisons = 0;
        int successfulSearches = 0;
        
        auto start = high_resolution_clock::now();
        
        for (int id : searchIDs) {
            int comparisons = 0;
            Employee* result = searchEmployee(id, comparisons);
            totalComparisons += comparisons;
            if (result) successfulSearches++;
        }
        
        auto end = high_resolution_clock::now();
        auto duration = duration_cast<microseconds>(end - start);
        
        cout << ">> Benchmark Results:\n";
        cout << "+-- Total Searches: " << searchIDs.size() << endl;
        cout << "+-- Successful Searches: " << successfulSearches << endl;
        cout << "+-- Total Time: " << duration.count() << " microseconds" << endl;
        cout << "+-- Average Time per Search: " << fixed << setprecision(2) 
             << (double)duration.count() / searchIDs.size() << " us" << endl;
        cout << "+-- Total Comparisons: " << totalComparisons << endl;
        cout << "+-- Average Comparisons per Search: " << fixed << setprecision(2) 
             << (double)totalComparisons / searchIDs.size() << endl;
    }
};

int main() {
    cout << "=== # Employee Database Management (Hash Table) ===\n\n";
    
    EmployeeHashTable empDB(13); // Start with smaller size to demonstrate rehashing
    
    cout << ">> Building employee database...\n";
    
    // Insert realistic employee data
    empDB.insertEmployee(101, "Alice Johnson", "Engineering", "Software Engineer", 95000, "alice@company.com", "555-0101");
    empDB.insertEmployee(102, "Bob Smith", "Engineering", "Senior Developer", 105000, "bob@company.com", "555-0102");
    empDB.insertEmployee(203, "Carol Davis", "Marketing", "Marketing Manager", 85000, "carol@company.com", "555-0203");
    empDB.insertEmployee(304, "David Wilson", "Sales", "Sales Representative", 65000, "david@company.com", "555-0304");
    empDB.insertEmployee(105, "Eve Brown", "Engineering", "DevOps Engineer", 90000, "eve@company.com", "555-0105");
    empDB.insertEmployee(206, "Frank Miller", "HR", "HR Specialist", 70000, "frank@company.com", "555-0206");
    empDB.insertEmployee(307, "Grace Lee", "Finance", "Financial Analyst", 75000, "grace@company.com", "555-0307");
    empDB.insertEmployee(108, "Henry Chen", "Engineering", "Tech Lead", 120000, "henry@company.com", "555-0108");
    empDB.insertEmployee(209, "Ivy Taylor", "Marketing", "Content Creator", 60000, "ivy@company.com", "555-0209");
    empDB.insertEmployee(310, "Jack Anderson", "Sales", "Sales Manager", 95000, "jack@company.com", "555-0310");
    
    // Demonstrate collisions by adding more employees
    empDB.insertEmployee(411, "Kate Wilson", "Legal", "Legal Counsel", 110000, "kate@company.com", "555-0411");
    empDB.insertEmployee(512, "Leo Martinez", "Operations", "Operations Manager", 88000, "leo@company.com", "555-0512");
    
    // Display the hash table structure
    empDB.displayTable();
    
    // Display all employees in formatted table
    empDB.displayAllEmployees();
    
    // Performance analysis
    empDB.analyzePerformance();
    
    // Demonstrate search functionality
    cout << "\n>> Employee Search Demonstrations:\n";
    
    vector<int> searchIDs = {101, 203, 999, 108, 310, 404};
    for (int id : searchIDs) {
        int comparisons = 0;
        auto start = high_resolution_clock::now();
        Employee* result = empDB.searchEmployee(id, comparisons);
        auto end = high_resolution_clock::now();
        auto duration = duration_cast<microseconds>(end - start);
        
        cout << "\nSearching for Employee ID " << id << ":\n";
        if (result) {
            cout << "[+] Found: " << result->name << " - " << result->position << endl;
        } else {
            cout << "[x] Employee not found" << endl;
        }
        cout << "[!] Comparisons: " << comparisons << ", Time: " << duration.count() << " us" << endl;
    }
    
    // Benchmark search performance
    vector<int> benchmarkIDs = {101, 102, 203, 304, 105, 206, 307, 108, 209, 310, 411, 512, 999, 888, 777};
    empDB.benchmarkSearch(benchmarkIDs);
    
    // Department-based search
    cout << "\n>> Department Search:\n";
    vector<Employee> engineers = empDB.searchByDepartment("Engineering");
    cout << "Engineering Department (" << engineers.size() << " employees):\n";
    for (const Employee& emp : engineers) {
        cout << "  * " << emp.name << " - " << emp.position << " ($" << emp.salary << ")" << endl;
    }
    
    // Salary statistics
    empDB.calculateSalaryStats();
    
    // Demonstrate deletion
    cout << "\n>> Employee Deletion Demonstration:\n";
    empDB.deleteEmployee(203); // Delete Carol Davis
    empDB.deleteEmployee(999); // Try to delete non-existent employee
    
    cout << "\n>> Updated Employee Directory:\n";
    empDB.displayAllEmployees();
    
    // Final performance analysis
    empDB.analyzePerformance();
    
    cout << "\n>> Hash Table Concepts Demonstrated:\n";
    cout << "* # Hash function maps keys to array indices\n";
    cout << "* -> Collision handling using chaining (linked lists)\n";
    cout << "* >> Load factor monitoring and automatic rehashing\n";
    cout << "* [!] O(1) average-case search, insert, delete operations\n";
    cout << "* >> Performance analysis: collisions, chain lengths, distribution\n\n";
    
    cout << ">> Real-world Applications:\n";
    cout << "* Database indexing and caching systems\n";
    cout << "* Employee and customer management systems\n";
    cout << "* Compiler symbol tables and runtime environments\n";
    cout << "* Web server session management\n";
    cout << "* Password storage and authentication systems\n";
    cout << "* Distributed systems (consistent hashing)\n";
    cout << "* Programming language implementations (dictionaries, maps)\n\n";
    
    cout << "Press any key to continue...";
    cin.get();
    
    return 0;
}