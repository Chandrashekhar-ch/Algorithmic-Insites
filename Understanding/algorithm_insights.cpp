// algorithm_insights.cpp
// Single-file interactive demo to learn data structures & complexity.
// Compile: g++ -std=c++17 -O2 algorithm_insights.cpp -o algorithm_insights

#include <bits/stdc++.h>
using namespace std;
using steady_clock_t = std::chrono::steady_clock;
using ms = std::chrono::milliseconds;
using fsec = std::chrono::duration<double>;

/////////////////////// Utilities ///////////////////////
struct Timer {
    steady_clock_t::time_point start;
    Timer(){ start = steady_clock_t::now(); }
    double elapsed_ms() const {
        return std::chrono::duration_cast<fsec>(steady_clock_t::now() - start).count() * 1000.0;
    }
};

template<typename F, typename... Args>
double time_ms(F&& f, Args&&... args) {
    Timer t;
    std::invoke(std::forward<F>(f), std::forward<Args>(args)...);
    return t.elapsed_ms();
}

void pause() {
    cout << "\nPress Enter to continue..."; cin.ignore(numeric_limits<streamsize>::max(), '\n');
}

/////////////////////// Section A: Arrays & Searching & Sorting ///////////////////////
struct OpCounter { long long comps=0, swaps=0; };

void print_vec(const vector<int>& a, int n = -1) {
    if(n==-1) n = (int)a.size();
    for(int i=0;i<min((int)a.size(), n);++i) cout << a[i] << " ";
    if((int)a.size() > n) cout << "...";
    cout << "\n";
}

// Generate dataset
vector<int> make_data(int n, int mode=0) {
    // mode: 0 random, 1 sorted, 2 reverse, 3 nearly sorted
    vector<int> v(n);
    std::mt19937_64 rng(1234567);
    for(int i=0;i<n;++i) v[i] = (int)(rng() % (n*3));
    if(mode==1) sort(v.begin(), v.end());
    else if(mode==2) { sort(v.begin(), v.end(), greater<int>()); }
    else if(mode==3) {
        sort(v.begin(), v.end());
        // shuffle a few elements
        for(int i=0;i<max(1,n/20); ++i) swap(v[i], v[n-1-i]);
    }
    return v;
}

// Linear search
int linear_search(const vector<int>& a, int key, OpCounter &op) {
    for(size_t i=0;i<a.size();++i){
        ++op.comps;
        if(a[i]==key) return (int)i;
    }
    return -1;
}

// Binary search (iterative) - array must be sorted
int binary_search_iter(const vector<int>& a, int key, OpCounter &op) {
    int l=0, r=(int)a.size()-1;
    while(l<=r) {
        ++op.comps;
        int mid = l + (r-l)/2;
        if(a[mid]==key) return mid;
        else if(a[mid] < key) { ++op.comps; l = mid+1; }
        else { ++op.comps; r = mid-1; }
    }
    return -1;
}

// Bubble sort
void bubble_sort(vector<int>& a, OpCounter &op) {
    int n = (int)a.size();
    for(int i=0;i<n-1;++i){
        for(int j=0;j<n-1-i;++j){
            ++op.comps;
            if(a[j] > a[j+1]) { swap(a[j], a[j+1]); ++op.swaps; }
        }
    }
}

// Insertion sort
void insertion_sort(vector<int>& a, OpCounter &op) {
    int n = (int)a.size();
    for(int i=1;i<n;++i) {
        int key = a[i]; int j=i-1;
        while(j>=0) {
            ++op.comps;
            if(a[j] > key) { a[j+1]=a[j]; --j; ++op.swaps; }
            else break;
        }
        a[j+1] = key;
    }
}

// Merge sort (with op counting)
void merge_sort_rec(vector<int>& a, int l, int r, OpCounter &op) {
    if(l>=r) return;
    int m = (l+r)/2;
    merge_sort_rec(a,l,m,op);
    merge_sort_rec(a,m+1,r,op);
    vector<int> tmp; tmp.reserve(r-l+1);
    int i=l, j=m+1;
    while(i<=m && j<=r){
        ++op.comps;
        if(a[i] <= a[j]) tmp.push_back(a[i++]);
        else tmp.push_back(a[j++]);
    }
    while(i<=m) tmp.push_back(a[i++]);
    while(j<=r) tmp.push_back(a[j++]);
    for(int k=0;k<(int)tmp.size();++k) a[l+k]=tmp[k];
}
void merge_sort(vector<int>& a, OpCounter &op){ merge_sort_rec(a,0,(int)a.size()-1,op); }

// Quick sort (Hoare partition)
int hoare_partition(vector<int>& a, int l, int r, OpCounter &op) {
    int pivot = a[l + (r-l)/2];
    int i = l-1, j = r+1;
    while(true){
        do { ++i; ++op.comps; } while(a[i] < pivot);
        do { --j; ++op.comps; } while(a[j] > pivot);
        if(i>=j) return j;
        swap(a[i], a[j]); ++op.swaps;
    }
}
void quick_sort_rec(vector<int>& a, int l, int r, OpCounter &op) {
    if(l<r) {
        int p = hoare_partition(a,l,r,op);
        quick_sort_rec(a,l,p,op);
        quick_sort_rec(a,p+1,r,op);
    }
}
void quick_sort(vector<int>& a, OpCounter &op){ if(!a.empty()) quick_sort_rec(a,0,(int)a.size()-1,op); }

void demo_arrays_search_sort() {
    cout << "=== Arrays, Searching & Sorting Demo ===\n";
    int n; cout << "Enter size of array to test (e.g., 5000 or 10000): ";
    if(!(cin>>n)) { cin.clear(); cin.ignore(); return; }
    int mode; cout << "Input distribution: 0=random 1=sorted 2=reverse 3=nearly sorted: "; cin>>mode;
    vector<int> base = make_data(n, mode);
    cout << "First 20 elements: "; print_vec(base, 20);

    // searching
    int key = base[n/3];
    cout << "\n-- Searching benchmarks (key taken from array to ensure found) --\n";
    OpCounter op;
    vector<int> arr = base;
    op = {}; double t1 = time_ms([&]{ linear_search(arr,key,op); });
    cout << "Linear search: comps="<<op.comps<<", time(ms)="<<t1<<"\n";
    sort(arr.begin(), arr.end());
    op = {}; double t2 = time_ms([&]{ binary_search_iter(arr,key,op); });
    cout << "Binary search (on sorted): comps="<<op.comps<<", time(ms)="<<t2<<"\n";

    // sorts
    cout << "\n-- Sorting benchmarks --\n";
    auto run_sort = [&](const string &name, function<void(vector<int>&, OpCounter&)> sortfn){
        vector<int> v = base;
        OpCounter o{};
        double t = time_ms([&]{ sortfn(v,o); });
        cout << name << " -> comps="<<o.comps<<", swaps="<<o.swaps<<", time(ms)="<<t<<"\n";
    };
    // Some sorts require different signature
    run_sort("Bubble Sort", [](vector<int>& v, OpCounter &o){ bubble_sort(v,o); });
    run_sort("Insertion Sort", [](vector<int>& v, OpCounter &o){ insertion_sort(v,o); });
    run_sort("Merge Sort", [](vector<int>& v, OpCounter &o){ merge_sort(v,o); });
    run_sort("Quick Sort", [](vector<int>& v, OpCounter &o){ quick_sort(v,o); });

    cout << "\n(Notice how bubble/insertion explode for large n if data random - they are O(n^2). Merge/Quick are ~O(n log n)).\n";
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    pause();
}

/////////////////////// Section B: Recursion ///////////////////////
long long fact_count = 0;
long long fib_calls_naive = 0;
long long fib_calls_memo = 0;

long long factorial(int n) {
    ++fact_count;
    if(n<=1) return 1;
    return n * factorial(n-1);
}

// naive fib
long long fib_naive(int n) {
    ++fib_calls_naive;
    if(n<=1) return n;
    return fib_naive(n-1) + fib_naive(n-2);
}

// memoized fib
long long fib_memo(int n, vector<long long>& memo) {
    ++fib_calls_memo;
    if(n<=1) return n;
    if(memo[n] != -1) return memo[n];
    memo[n] = fib_memo(n-1,memo) + fib_memo(n-2,memo);
    return memo[n];
}

void demo_recursion() {
    cout << "=== Recursion Demo ===\n";
    int n;
    cout << "Factorial n (<=20 recommended): "; cin >> n;
    fact_count = 0;
    Timer t; long long f = factorial(n);
    cout << "factorial("<<n<<") = "<<f<<", call count="<<fact_count<<", time(ms)="<<t.elapsed_ms()<<"\n";

    cout << "\nFibonacci naive vs memoized. Enter n (<=40 for naive): ";
    cin >> n;
    fib_calls_naive = fib_calls_memo = 0;
    Timer t1; long long fn = fib_naive(n); double tnaive = t1.elapsed_ms();
    Timer t2; vector<long long> memo(n+1, -1); long long fm = fib_memo(n, memo); double tmemo = t2.elapsed_ms();
    cout << "fib_naive("<<n<<")="<<fn<<", calls="<<fib_calls_naive<<", time(ms)="<<tnaive<<"\n";
    cout << "fib_memo("<<n<<")="<<fm<<", calls="<<fib_calls_memo<<", time(ms)="<<tmemo<<"\n";
    cout << "Observation: naive uses exponential calls ~O(2^n); memoized is O(n).\n";
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    pause();
}

/////////////////////// Section C: Stacks & Queues ///////////////////////
// simple evaluate postfix expression using stack (integers and +,-,*,/)
int eval_postfix(const string &expr) {
    std::stack<int> st;
    std::istringstream ss(expr);
    string tok;
    while(ss >> tok){
        if(isdigit(tok[0]) || (tok.size()>1 && tok[0]=='-')) {
            st.push(stoi(tok));
        } else {
            if(st.size()<2) throw runtime_error("invalid expr");
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            if(tok=="+") st.push(a+b);
            else if(tok=="-") st.push(a-b);
            else if(tok=="*") st.push(a*b);
            else if(tok=="/") st.push(a/b);
            else throw runtime_error("unknown op");
        }
    }
    if(st.size()!=1) throw runtime_error("invalid expr end");
    return st.top();
}

// infix to postfix (Shunting-yard - demonstration)
int prec(char c){
    if(c=='+'||c=='-') return 1;
    if(c=='*'||c=='/') return 2;
    return 0;
}
string infix_to_postfix(const string &s) {
    string out;
    stack<char> ops;
    for(size_t i=0;i<s.size();++i) {
        char c = s[i];
        if(isspace(c)) continue;
        if(isdigit(c)) {
            // read full number
            string num;
            while(i<s.size() && (isdigit(s[i]) || s[i]=='-')) { num.push_back(s[i]); ++i; }
            --i;
            out += num;
            out += ' ';
        } else if(c=='(') ops.push(c);
        else if(c==')') {
            while(!ops.empty() && ops.top()!='(') { out.push_back(ops.top()); out.push_back(' '); ops.pop(); }
            if(!ops.empty()) ops.pop(); // pop '('
        } else {
            while(!ops.empty() && prec(ops.top()) >= prec(c)) {
                out.push_back(ops.top()); out.push_back(' ');
                ops.pop();
            }
            ops.push(c);
        }
    }
    while(!ops.empty()) { out.push_back(ops.top()); out.push_back(' '); ops.pop(); }
    return out;
}

void demo_stack_queue() {
    cout << "=== Stacks & Queues Demo ===\n";
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cout << "Example: convert infix to postfix and evaluate.\n";
    cout << "Enter infix expression (e.g., 3 + 4 * (2 - 1)): ";
    string line; getline(cin, line);
    string postfix = infix_to_postfix(line);
    cout << "Postfix: " << postfix << "\n";
    try {
        int val = eval_postfix(postfix);
        cout << "Evaluated result: " << val << "\n";
    } catch(exception &e) {
        cout << "Evaluation error: " << e.what() << "\n";
    }
    // queue demo: simple producer-consumer simulation (no threads)
    cout << "\nQueue demo (simulated packet processing). Enter number of packets to simulate: ";
    int m; if(!(cin >> m)) { cin.clear(); cin.ignore(); return; }
    queue<int> q;
    for(int i=1;i<=m;++i) {
        q.push(i);
        if(i%3==0) { // process one packet every 3 arrives
            cout << "Processing packet: " << q.front() << "\n"; q.pop();
        }
    }
    cout << "Remaining in queue: " << q.size() << "\n";
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    pause();
}

/////////////////////// Section D: Linked Lists ///////////////////////
struct SNode {
    int val; SNode* next;
    SNode(int v): val(v), next(nullptr){}
};
struct DNode {
    int val; DNode *next, *prev;
    DNode(int v): val(v), next(nullptr), prev(nullptr){}
};

class SinglyLinkedList {
public:
    SNode* head;
    SinglyLinkedList(): head(nullptr){}
    void push_front(int v) {
        SNode* n = new SNode(v); n->next=head; head=n;
    }
    void push_back(int v) {
        SNode* n = new SNode(v);
        if(!head) { head=n; return; }
        SNode* cur=head; while(cur->next) cur=cur->next; cur->next=n;
    }
    bool remove_first(int v) {
        SNode dummy(0); dummy.next=head;
        SNode* prev = &dummy;
        while(prev->next) {
            if(prev->next->val==v) {
                SNode* to = prev->next;
                prev->next = to->next;
                if(to==head) head = prev->next;
                delete to;
                head = dummy.next;
                return true;
            }
            prev = prev->next;
        }
        return false;
    }
    void traverse_print(int limit=50) {
        SNode* cur=head;
        int cnt=0;
        while(cur && cnt++<limit) { cout<<cur->val<<" "; cur=cur->next; }
        if(cur) cout << "...";
        cout << "\n";
    }
};

void demo_linked_list() {
    cout << "=== Linked List Demo ===\n";
    SinglyLinkedList L;
    cout << "Build list by entering 5 numbers: ";
    for(int i=0;i<5;++i){ int x; cin>>x; L.push_back(x); }
    cout << "List: "; L.traverse_print();
    cout << "Push front 99\n"; L.push_front(99); L.traverse_print();
    cout << "Remove first occurrence of a number. Enter value: ";
    int val; cin>>val; bool removed = L.remove_first(val);
    cout << (removed ? "Removed.\n" : "Not found.\n");
    cout << "List now: "; L.traverse_print();
    cout << "\nLRU cache demo (conceptual): We'll simulate using std::list + unordered_map.\n";
    // quick LRU demonstration
    int capacity = 3;
    list<int> order;
    unordered_map<int, list<int>::iterator> mp;
    vector<int> requests = {1,2,3,1,4,5,2,1};
    cout << "Requests sequence: ";
    for(int r: requests) cout<<r<<" "; cout<<"\n";
    for(int r: requests) {
        if(mp.find(r) != mp.end()) {
            order.erase(mp[r]);
            order.push_front(r);
            mp[r] = order.begin();
            cout << "Access "<<r<<" -> HIT. Order: ";
        } else {
            if((int)order.size() == capacity){
                int last = order.back(); order.pop_back(); mp.erase(last);
                cout << "Evict "<<last<<". ";
            }
            order.push_front(r);
            mp[r] = order.begin();
            cout << "Access "<<r<<" -> MISS. Order: ";
        }
        for(int x: order) cout<<x<<" "; cout<<"\n";
    }
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    pause();
}

/////////////////////// Section E: Trees (BST) ///////////////////////
struct BSTNode {
    int key;
    BSTNode *left, *right;
    BSTNode(int k): key(k), left(nullptr), right(nullptr){}
};

BSTNode* bst_insert(BSTNode* root, int key) {
    if(!root) return new BSTNode(key);
    if(key < root->key) root->left = bst_insert(root->left, key);
    else root->right = bst_insert(root->right, key);
    return root;
}
bool bst_search(BSTNode* root, int key) {
    if(!root) return false;
    if(root->key == key) return true;
    if(key < root->key) return bst_search(root->left, key);
    return bst_search(root->right, key);
}
void bst_inorder(BSTNode* root) {
    if(!root) return;
    bst_inorder(root->left); cout<<root->key<<" "; bst_inorder(root->right);
}

void demo_trees() {
    cout << "=== Trees (BST) Demo ===\n";
    cout << "Enter number of nodes to insert into BST (e.g., 10): ";
    int n; cin>>n;
    cout << "Choose distribution: 0=random 1=sorted(seq ascending) 2=reverse seq: ";
    int mode; cin>>mode;
    vector<int> keys;
    if(mode==1) for(int i=1;i<=n;++i) keys.push_back(i);
    else if(mode==2) for(int i=n;i>=1;--i) keys.push_back(i);
    else { mt19937 rng(12345); for(int i=0;i<n;++i) keys.push_back((int)(rng()% (n*3))); }
    BSTNode* root = nullptr;
    for(int k: keys) root = bst_insert(root, k);
    cout << "Inorder traversal (first 50): "; bst_inorder(root); cout<<"\n";
    cout << "Search for an element (enter key): ";
    int q; cin>>q;
    bool found = bst_search(root, q);
    cout << "Found? " << (found ? "Yes":"No") << "\n";
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    pause();
}

/////////////////////// Section F: Graphs ///////////////////////
struct Graph {
    int n;
    vector<vector<pair<int,int>>> adj; // pair(neighbor, weight)
    Graph(int n=0): n(n), adj(n) {}
    void add_edge(int u,int v,int w=1){ adj[u].push_back({v,w}); }
    void bfs(int s) {
        vector<int> dist(n,-1); queue<int>q; dist[s]=0; q.push(s);
        while(!q.empty()){
            int u=q.front(); q.pop();
            cout << "Visited " << u << " dist=" << dist[u] << "\n";
            for(auto &pr: adj[u]) if(dist[pr.first]==-1){ dist[pr.first]=dist[u]+1; q.push(pr.first); }
        }
    }
    void dfs_util(int u, vector<int>& vis) {
        vis[u]=1; cout << u << " ";
        for(auto &pr: adj[u]) if(!vis[pr.first]) dfs_util(pr.first, vis);
    }
    void dfs(int s) {
        vector<int> vis(n,0); dfs_util(s, vis); cout<<"\n";
    }
    // Dijkstra (weights >=0)
    vector<long long> dijkstra(int s) {
        const long long INF = (1LL<<60);
        vector<long long> dist(n, INF);
        using pli = pair<long long,int>;
        priority_queue<pli, vector<pli>, greater<pli>> pq;
        dist[s]=0; pq.push({0,s});
        while(!pq.empty()){
            auto top_pair = pq.top(); pq.pop();
            long long d = top_pair.first;
            int u = top_pair.second;
            if(d!=dist[u]) continue;
            for(auto &pr: adj[u]) {
                int v = pr.first; int w=pr.second;
                if(dist[v] > dist[u] + w) {
                    dist[v] = dist[u] + w;
                    pq.push({dist[v], v});
                }
            }
        }
        return dist;
    }
};

void demo_graphs() {
    cout << "=== Graphs Demo ===\n";
    cout << "We'll build a small directed graph with 6 nodes.\n";
    Graph g(6);
    g.add_edge(0,1,2);
    g.add_edge(0,2,4);
    g.add_edge(1,2,1);
    g.add_edge(1,3,7);
    g.add_edge(2,4,3);
    g.add_edge(4,3,2);
    g.add_edge(3,5,1);
    cout << "BFS from 0:\n"; g.bfs(0);
    cout << "DFS from 0: "; g.dfs(0);
    cout << "Dijkstra from 0 distances: ";
    auto d = g.dijkstra(0);
    for(int i=0;i<(int)d.size();++i){
        cout << i << ":" << (d[i] >= (1LL<<50) ? -1 : d[i]) << " ";
    }
    cout << "\n";
    pause();
}

/////////////////////// Section G: Hashing ///////////////////////
void demo_hashing() {
    cout << "=== Hashing Demo ===\n";
    cout << "Using unordered_map: store key->value and measure simple ops\n";
    unordered_map<int,string> mp;
    mp[1] = "one"; mp[2]="two"; mp[100]="hundred";
    cout << "mp[2] = "<<mp[2]<<"\n";
    cout << "Load factor: " << mp.load_factor() << " bucket_count: " << mp.bucket_count() << "\n";
    cout << "Collision/load demonstration: insert many keys and check average bucket size.\n";
    unordered_map<int,int> big;
    int N = 100000;
    for(int i=0;i<N;++i) big[i] = i;
    double avg_bucket = 0.0;
    for(size_t b=0;b<big.bucket_count();++b) avg_bucket += big.bucket_size(b);
    avg_bucket /= big.bucket_count();
    cout << "Inserted " << N << " keys. buckets="<<big.bucket_count()<<" avg_bucket_size="<<avg_bucket<<"\n";
    cout << "Lookup time sample (10 lookups):\n";
    Timer t;
    for(int i=0;i<10;++i) {
        volatile int x = big[rand() % N];
        (void)x;
    }
    cout << "Elapsed (ms) for 10 lookups: " << t.elapsed_ms() << "\n";
    pause();
}

/////////////////////// Menu ///////////////////////
int main_menu(){
    cout << "\n=== algorithm_insights (C++ demo) ===\n";
    cout << "Pick a demo to run:\n";
    cout << "1. Arrays, Searching & Sorting (with benchmarks)\n";
    cout << "2. Recursion (factorial, fib naive vs memo)\n";
    cout << "3. Stacks & Queues (infix->postfix, queue sim)\n";
    cout << "4. Linked List (ops + LRU demo)\n";
    cout << "5. Trees (BST demo)\n";
    cout << "6. Graphs (BFS/DFS/Dijkstra)\n";
    cout << "7. Hashing (unordered_map demo)\n";
    cout << "8. Run a quick automated micro-benchmark (all sections, small n)\n";
    cout << "0. Exit\n";
    cout << "Enter choice: ";
    int c; 
    if(!(cin>>c)){ 
        cout<<"Invalid input\n"; 
        cin.clear(); 
        cin.ignore(numeric_limits<streamsize>::max(), '\n'); 
        return -1; 
    } 
    return c;
}

void run_all_small() {
    cout << "Running automated small tests for each module...\n";
    // Arrays test
    {
        vector<int> v = make_data(2000,0);
        OpCounter o;
        double t = time_ms([&]{ merge_sort(v,o); });
        cout << "Merge sort on 2000 items: comps="<<o.comps<<", time(ms)="<<t<<"\n";
    }
    // Recursion
    {
        int n=25; fact_count=0; double t = time_ms([&]{ factorial(15); });
        cout << "factorial(15) callcount="<<fact_count<<", time(ms)="<<t<<"\n";
    }
    // Stack/Queue demo omitted heavy IO
    // Linked list
    {
        SinglyLinkedList L; for(int i=0;i<1000;++i) L.push_back(i);
        double t = time_ms([&]{ L.push_back(1001); });
        cout << "Linked list push_back on 1000 nodes time(ms)="<<t<<"\n";
    }
    // BST
    {
        BSTNode* root = nullptr; for(int i=0;i<1000;++i) root = bst_insert(root, i);
        double t = time_ms([&]{ bst_search(root, 999); });
        cout << "BST search (balanced-like insert order) time(ms)="<<t<<"\n";
    }
    // Graph
    {
        Graph g(1000); for(int i=0;i<999;++i) g.add_edge(i,i+1,1);
        double t = time_ms([&]{ g.bfs(0); });
        cout << "BFS on 1000-chain time(ms)="<<t<<"\n";
    }
    cout << "Automated tests done.\n";
    pause();
}

int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    while(true){
        int choice = main_menu();
        if(choice==0) { cout<<"Goodbye!\n"; break; }
        switch(choice){
            case 1: demo_arrays_search_sort(); break;
            case 2: demo_recursion(); break;
            case 3: demo_stack_queue(); break;
            case 4: demo_linked_list(); break;
            case 5: demo_trees(); break;
            case 6: demo_graphs(); break;
            case 7: demo_hashing(); break;
            case 8: run_all_small(); break;
            default: cout << "Unknown choice\n"; break;
        }
    }
    return 0;
}
