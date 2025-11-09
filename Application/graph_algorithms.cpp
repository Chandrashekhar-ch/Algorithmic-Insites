/*
 * 🌐 Graphs — Social Network Friend Connections
 * 
 * Real-world analogy:
 * Social media platforms like Facebook, LinkedIn, Instagram use graphs to represent
 * user relationships, suggest friends, detect communities, and analyze network structures.
 * 
 * Time Complexity:
 * - BFS: O(V + E) where V = vertices, E = edges
 * - DFS: O(V + E)
 * - Adding edge: O(1)
 * - Space Complexity: O(V + E) for adjacency list representation
 */

#include <iostream>
#include <vector>
#include <queue>
#include <stack>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <chrono>
#include <iomanip>
using namespace std;
using namespace std::chrono;

struct User {
    string name;
    string profession;
    int age;
    vector<string> interests;
    
    User(string n = "", string p = "", int a = 0, vector<string> i = {}) 
        : name(n), profession(p), age(a), interests(i) {}
};

class SocialNetwork {
private:
    unordered_map<string, vector<string>> adjacencyList;
    unordered_map<string, User> userProfiles;
    int totalEdges;
    
public:
    SocialNetwork() : totalEdges(0) {}
    
    // Add a new user to the network
    void addUser(string name, string profession = "", int age = 0, vector<string> interests = {}) {
        userProfiles[name] = User(name, profession, age, interests);
        // Initialize adjacency list if not exists
        if (adjacencyList.find(name) == adjacencyList.end()) {
            adjacencyList[name] = vector<string>();
        }
    }
    
    // Create friendship (undirected connection)
    void addFriendship(string user1, string user2) {
        // Add users if they don't exist
        if (userProfiles.find(user1) == userProfiles.end()) {
            addUser(user1);
        }
        if (userProfiles.find(user2) == userProfiles.end()) {
            addUser(user2);
        }
        
        // Add bidirectional connection
        adjacencyList[user1].push_back(user2);
        adjacencyList[user2].push_back(user1);
        totalEdges++;
    }
    
    // Display the complete social network
    void displayNetwork() {
        cout << "👥 Social Network Connections:\n";
        cout << "┌────────────────────────────────────────────────────────┐\n";
        
        for (const auto& pair : adjacencyList) {
            const User& user = userProfiles[pair.first];
            cout << "│ " << left << setw(15) << pair.first;
            
            if (!user.profession.empty()) {
                cout << "(" << user.profession << ")";
            }
            cout << " → ";
            
            for (size_t i = 0; i < pair.second.size(); i++) {
                cout << pair.second[i];
                if (i < pair.second.size() - 1) cout << ", ";
            }
            cout << endl;
        }
        cout << "└────────────────────────────────────────────────────────┘\n";
    }
    
    // BFS traversal - simulates friend suggestion algorithm
    void bfsTraversal(string startUser, int maxDistance = 3) {
        if (adjacencyList.find(startUser) == adjacencyList.end()) {
            cout << "❌ User not found in network\n";
            return;
        }
        
        cout << "\n🔍 BFS Network Exploration from '" << startUser << "':\n";
        cout << "(Simulating friend suggestions and network discovery)\n\n";
        
        unordered_map<string, bool> visited;
        unordered_map<string, int> distance;
        queue<string> q;
        
        auto start = high_resolution_clock::now();
        
        q.push(startUser);
        visited[startUser] = true;
        distance[startUser] = 0;
        
        cout << "Distance 0 (You): " << startUser << endl;
        
        int currentDistance = 0;
        vector<vector<string>> levels(maxDistance + 1);
        
        while (!q.empty()) {
            string currentUser = q.front();
            q.pop();
            
            for (const string& neighbor : adjacencyList[currentUser]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    distance[neighbor] = distance[currentUser] + 1;
                    
                    if (distance[neighbor] <= maxDistance) {
                        levels[distance[neighbor]].push_back(neighbor);
                        q.push(neighbor);
                    }
                }
            }
        }
        
        auto end = high_resolution_clock::now();
        auto duration = duration_cast<microseconds>(end - start);
        
        // Display results by distance level
        for (int level = 1; level <= maxDistance; level++) {
            if (!levels[level].empty()) {
                cout << "Distance " << level << " (";
                if (level == 1) cout << "Direct friends";
                else if (level == 2) cout << "Friends of friends";
                else cout << "Distant connections";
                cout << "): ";
                
                for (size_t i = 0; i < levels[level].size(); i++) {
                    cout << levels[level][i];
                    if (i < levels[level].size() - 1) cout << ", ";
                }
                cout << endl;
            }
        }
        
        cout << "\n⏱️ BFS completed in " << duration.count() << " microseconds\n";
        cout << "👥 Total users reached: " << visited.size() - 1 << endl;
    }
    
    // DFS traversal - simulates deep network analysis
    void dfsTraversal(string startUser) {
        if (adjacencyList.find(startUser) == adjacencyList.end()) {
            cout << "❌ User not found in network\n";
            return;
        }
        
        cout << "\n🕳️ DFS Network Analysis from '" << startUser << "':\n";
        cout << "(Simulating deep connection analysis)\n\n";
        
        unordered_set<string> visited;
        stack<string> dfsStack;
        vector<string> traversalPath;
        
        auto start = high_resolution_clock::now();
        
        dfsStack.push(startUser);
        
        while (!dfsStack.empty()) {
            string currentUser = dfsStack.top();
            dfsStack.pop();
            
            if (visited.find(currentUser) == visited.end()) {
                visited.insert(currentUser);
                traversalPath.push_back(currentUser);
                
                // Add neighbors to stack (in reverse order for consistent traversal)
                vector<string> neighbors = adjacencyList[currentUser];
                sort(neighbors.rbegin(), neighbors.rend());
                
                for (const string& neighbor : neighbors) {
                    if (visited.find(neighbor) == visited.end()) {
                        dfsStack.push(neighbor);
                    }
                }
            }
        }
        
        auto end = high_resolution_clock::now();
        auto duration = duration_cast<microseconds>(end - start);
        
        cout << "DFS Path: ";
        for (size_t i = 0; i < traversalPath.size(); i++) {
            cout << traversalPath[i];
            if (i < traversalPath.size() - 1) cout << " → ";
        }
        cout << endl;
        
        cout << "⏱️ DFS completed in " << duration.count() << " microseconds\n";
        cout << "👥 Total users reached: " << visited.size() << endl;
    }
    
    // Find mutual friends between two users
    vector<string> findMutualFriends(string user1, string user2) {
        vector<string> mutualFriends;
        
        if (adjacencyList.find(user1) == adjacencyList.end() || 
            adjacencyList.find(user2) == adjacencyList.end()) {
            return mutualFriends;
        }
        
        unordered_set<string> user1Friends(adjacencyList[user1].begin(), adjacencyList[user1].end());
        
        for (const string& friend2 : adjacencyList[user2]) {
            if (user1Friends.find(friend2) != user1Friends.end()) {
                mutualFriends.push_back(friend2);
            }
        }
        
        return mutualFriends;
    }
    
    // Suggest friends based on mutual connections
    void suggestFriends(string userName) {
        cout << "\n💡 Friend Suggestions for '" << userName << "':\n";
        
        if (adjacencyList.find(userName) == adjacencyList.end()) {
            cout << "❌ User not found\n";
            return;
        }
        
        unordered_map<string, int> suggestionScore;
        unordered_set<string> currentFriends(adjacencyList[userName].begin(), adjacencyList[userName].end());
        currentFriends.insert(userName); // Don't suggest self
        
        // Calculate suggestion scores based on mutual friends
        for (const string& friendName : adjacencyList[userName]) {
            for (const string& friendOfFriend : adjacencyList[friendName]) {
                if (currentFriends.find(friendOfFriend) == currentFriends.end()) {
                    suggestionScore[friendOfFriend]++;
                }
            }
        }
        
        // Sort suggestions by score
        vector<pair<string, int>> suggestions;
        for (const auto& pair : suggestionScore) {
            suggestions.push_back({pair.first, pair.second});
        }
        
        sort(suggestions.begin(), suggestions.end(), 
             [](const pair<string, int>& a, const pair<string, int>& b) {
                 return a.second > b.second;
             });
        
        // Display top suggestions
        int maxSuggestions = min(5, (int)suggestions.size());
        for (int i = 0; i < maxSuggestions; i++) {
            cout << "🤝 " << suggestions[i].first << " (" << suggestions[i].second 
                 << " mutual friend" << (suggestions[i].second > 1 ? "s" : "") << ")" << endl;
        }
        
        if (suggestions.empty()) {
            cout << "📭 No friend suggestions available\n";
        }
    }
    
    // Analyze network properties
    void analyzeNetwork() {
        cout << "\n📊 Social Network Analysis:\n";
        cout << "├── Total Users: " << userProfiles.size() << endl;
        cout << "├── Total Connections: " << totalEdges << endl;
        cout << "├── Average Connections per User: " 
             << fixed << setprecision(2) << (2.0 * totalEdges) / userProfiles.size() << endl;
        
        // Find user with most connections
        string mostConnectedUser;
        int maxConnections = 0;
        
        for (const auto& pair : adjacencyList) {
            if ((int)pair.second.size() > maxConnections) {
                maxConnections = pair.second.size();
                mostConnectedUser = pair.first;
            }
        }
        
        cout << "├── Most Connected User: " << mostConnectedUser 
             << " (" << maxConnections << " connections)" << endl;
        
        // Calculate network density
        int maxPossibleEdges = userProfiles.size() * (userProfiles.size() - 1) / 2;
        double density = (double)totalEdges / maxPossibleEdges * 100;
        cout << "└── Network Density: " << fixed << setprecision(1) 
             << density << "% of possible connections" << endl;
    }
    
    // Display detailed user profile
    void showUserProfile(string userName) {
        if (userProfiles.find(userName) == userProfiles.end()) {
            cout << "❌ User not found\n";
            return;
        }
        
        const User& user = userProfiles[userName];
        cout << "\n👤 User Profile: " << userName << "\n";
        cout << "┌────────────────────────────────────┐\n";
        cout << "│ Profession: " << left << setw(20) << user.profession << "│\n";
        cout << "│ Age: " << left << setw(27) << user.age << "│\n";
        cout << "│ Connections: " << left << setw(18) << adjacencyList[userName].size() << "│\n";
        
        if (!user.interests.empty()) {
            cout << "│ Interests: ";
            for (size_t i = 0; i < user.interests.size(); i++) {
                cout << user.interests[i];
                if (i < user.interests.size() - 1) cout << ", ";
            }
            cout << endl;
        }
        cout << "└────────────────────────────────────┘\n";
    }
};

int main() {
    cout << "=== 🌐 Social Network Analysis (Graph Algorithms) ===\n\n";
    
    SocialNetwork network;
    
    // Create users with detailed profiles
    network.addUser("Alice", "Software Engineer", 28, {"Programming", "Gaming", "Travel"});
    network.addUser("Bob", "Data Scientist", 32, {"AI", "Music", "Hiking"});
    network.addUser("Charlie", "Designer", 25, {"Art", "Photography", "Movies"});
    network.addUser("Diana", "Product Manager", 30, {"Business", "Reading", "Yoga"});
    network.addUser("Eve", "Teacher", 27, {"Education", "Cooking", "Gardening"});
    network.addUser("Frank", "Developer", 29, {"Programming", "Sports", "Music"});
    network.addUser("Grace", "Analyst", 26, {"Data", "Travel", "Photography"});
    network.addUser("Henry", "Consultant", 31, {"Business", "Golf", "Reading"});
    
    // Build the social network with realistic connections
    cout << "🔗 Building social network connections...\n";
    
    // Core friend groups
    network.addFriendship("Alice", "Bob");
    network.addFriendship("Alice", "Charlie");
    network.addFriendship("Alice", "Frank"); // Common interest: Programming
    
    network.addFriendship("Bob", "Diana");
    network.addFriendship("Bob", "Grace"); // Common interest: Data
    
    network.addFriendship("Charlie", "Eve");
    network.addFriendship("Charlie", "Grace"); // Common interest: Photography
    
    network.addFriendship("Diana", "Henry"); // Common interest: Business
    network.addFriendship("Diana", "Eve");
    
    network.addFriendship("Frank", "Grace");
    network.addFriendship("Frank", "Bob"); // Common interest: Music
    
    network.addFriendship("Grace", "Henry");
    
    // Display network overview
    network.displayNetwork();
    network.analyzeNetwork();
    
    // Demonstrate BFS (Friend Discovery)
    network.bfsTraversal("Alice", 3);
    
    // Demonstrate DFS (Deep Network Analysis)
    network.dfsTraversal("Alice");
    
    // Show friend suggestions
    network.suggestFriends("Alice");
    network.suggestFriends("Henry");
    
    // Demonstrate mutual friends
    cout << "\n👥 Mutual Friends Analysis:\n";
    vector<string> mutual = network.findMutualFriends("Alice", "Grace");
    cout << "Mutual friends between Alice and Grace: ";
    if (mutual.empty()) {
        cout << "None\n";
    } else {
        for (size_t i = 0; i < mutual.size(); i++) {
            cout << mutual[i];
            if (i < mutual.size() - 1) cout << ", ";
        }
        cout << endl;
    }
    
    // Show detailed user profiles
    network.showUserProfile("Alice");
    network.showUserProfile("Bob");
    
    cout << "\n🧩 Graph Concepts Demonstrated:\n";
    cout << "• 🌐 Adjacency list representation for efficient storage\n";
    cout << "• 🔍 BFS for shortest path and level-wise exploration\n";
    cout << "• 🕳️ DFS for deep traversal and connectivity analysis\n";
    cout << "• 🤝 Practical applications: friend suggestions, mutual connections\n";
    cout << "• 📊 Network analysis: density, centrality, clustering\n\n";
    
    cout << "💡 Real-world Applications:\n";
    cout << "• Social media platforms (Facebook, LinkedIn, Instagram)\n";
    cout << "• Recommendation systems (Netflix, Amazon, Spotify)\n";
    cout << "• Navigation and mapping (Google Maps, GPS routing)\n";
    cout << "• Network security and fraud detection\n";
    cout << "• Supply chain and logistics optimization\n";
    cout << "• Web crawling and search engine indexing\n";
    
    return 0;
}