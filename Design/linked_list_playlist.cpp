/*
 * 🧬 Linked List — Music Playlist Manager
 * 
 * Real-world analogy:
 * Spotify, Apple Music, or any media player uses linked lists to navigate songs 
 * (Next, Previous). Demonstrates dynamic memory allocation and pointer manipulation.
 * 
 * Time Complexity:
 * - Add song: O(1) at head/tail, O(n) at specific position
 * - Navigate next/previous: O(1)
 * - Search song: O(n)
 * - Remove song: O(1) if node known, O(n) if searching first
 * Space Complexity: O(n) where n is number of songs
 */

#include <iostream>
#include <string>
#include <chrono>
#include <iomanip>
#include <vector>
#include <random>
using namespace std;
using namespace std::chrono;

struct Song {
    string title;
    string artist;
    string album;
    int duration; // in seconds
    string genre;
    Song* next;
    Song* prev;
    
    Song(string t, string a = "Unknown Artist", string al = "Unknown Album", 
         int d = 180, string g = "Pop") 
        : title(t), artist(a), album(al), duration(d), genre(g), next(nullptr), prev(nullptr) {}
    
    string getFormattedDuration() const {
        int minutes = duration / 60;
        int seconds = duration % 60;
        return to_string(minutes) + ":" + (seconds < 10 ? "0" : "") + to_string(seconds);
    }
};

class MusicPlaylist {
private:
    Song* head;
    Song* tail;
    Song* current;
    string playlistName;
    int totalSongs;
    int totalDuration;
    bool isPlaying;
    bool isShuffled;
    vector<string> playHistory;

public:
    MusicPlaylist(const string& name) 
        : head(nullptr), tail(nullptr), current(nullptr), playlistName(name),
          totalSongs(0), totalDuration(0), isPlaying(false), isShuffled(false) {
        cout << "=== 🎵 Music Playlist Manager ===\n\n";
        cout << "🎧 Created Playlist: \"" << playlistName << "\"\n\n";
    }

    ~MusicPlaylist() {
        // Clean up memory
        while (head) {
            Song* temp = head;
            head = head->next;
            delete temp;
        }
    }

    void addSong(const string& title, const string& artist = "Unknown Artist", 
                 const string& album = "Unknown Album", int duration = 180, 
                 const string& genre = "Pop") {
        Song* newSong = new Song(title, artist, album, duration, genre);
        
        if (!head) {
            // First song in playlist
            head = tail = current = newSong;
        } else {
            // Add to end of playlist
            tail->next = newSong;
            newSong->prev = tail;
            tail = newSong;
        }
        
        totalSongs++;
        totalDuration += duration;
        
        cout << "🎵 Added: \"" << title << "\" by " << artist 
             << " (" << newSong->getFormattedDuration() << ")\n";
        
        playHistory.push_back("ADDED: " + title + " by " + artist);
        showPlaylistStatus();
    }

    void removeSong(const string& title) {
        Song* songToRemove = findSong(title);
        
        if (!songToRemove) {
            cout << "❌ Song \"" << title << "\" not found in playlist\n";
            return;
        }
        
        // Update current if we're removing the current song
        if (songToRemove == current) {
            if (current->next) {
                current = current->next;
            } else if (current->prev) {
                current = current->prev;
            } else {
                current = nullptr;
            }
        }
        
        // Update links
        if (songToRemove->prev) {
            songToRemove->prev->next = songToRemove->next;
        } else {
            head = songToRemove->next;
        }
        
        if (songToRemove->next) {
            songToRemove->next->prev = songToRemove->prev;
        } else {
            tail = songToRemove->prev;
        }
        
        totalSongs--;
        totalDuration -= songToRemove->duration;
        
        cout << "🗑️ Removed: \"" << songToRemove->title << "\" by " << songToRemove->artist << "\n";
        playHistory.push_back("REMOVED: " + songToRemove->title);
        
        delete songToRemove;
        showPlaylistStatus();
    }

    void playNext() {
        if (!current) {
            cout << "❌ No songs in playlist to play\n";
            return;
        }
        
        if (current->next) {
            current = current->next;
            isPlaying = true;
            cout << "⏭️ Next Song:\n";
            displayCurrentSong();
            playHistory.push_back("PLAYED: " + current->title);
        } else {
            cout << "🔚 End of playlist! Would you like to restart from the beginning?\n";
        }
    }

    void playPrevious() {
        if (!current) {
            cout << "❌ No songs in playlist to play\n";
            return;
        }
        
        if (current->prev) {
            current = current->prev;
            isPlaying = true;
            cout << "⏮️ Previous Song:\n";
            displayCurrentSong();
            playHistory.push_back("PLAYED: " + current->title);
        } else {
            cout << "🔚 At the beginning of the playlist!\n";
        }
    }

    void playFromBeginning() {
        if (!head) {
            cout << "❌ Playlist is empty!\n";
            return;
        }
        
        current = head;
        isPlaying = true;
        cout << "🎬 Starting playlist from the beginning:\n";
        displayCurrentSong();
        playHistory.push_back("STARTED: " + current->title);
    }

    void jumpToSong(const string& title) {
        Song* song = findSong(title);
        
        if (!song) {
            cout << "❌ Song \"" << title << "\" not found in playlist\n";
            return;
        }
        
        current = song;
        isPlaying = true;
        cout << "🎯 Jumped to song:\n";
        displayCurrentSong();
        playHistory.push_back("JUMPED: " + current->title);
    }

    void pause() {
        if (isPlaying) {
            isPlaying = false;
            cout << "⏸️ Playback paused\n";
            playHistory.push_back("PAUSED");
        } else {
            cout << "⚠️ Already paused\n";
        }
    }

    void resume() {
        if (!isPlaying && current) {
            isPlaying = true;
            cout << "▶️ Playback resumed:\n";
            displayCurrentSong();
            playHistory.push_back("RESUMED: " + current->title);
        } else if (!current) {
            cout << "❌ No song selected to resume\n";
        } else {
            cout << "⚠️ Already playing\n";
        }
    }

    void showFullPlaylist() {
        if (!head) {
            cout << "📭 Playlist \"" << playlistName << "\" is empty\n";
            return;
        }
        
        cout << "\n🎧 Playlist: \"" << playlistName << "\"\n";
        cout << "╔═══╦═══════════════════════════════════════════════════════════════════════╗\n";
        cout << "║ # ║ Song Details                                                          ║\n";
        cout << "╠═══╬═══════════════════════════════════════════════════════════════════════╣\n";
        
        Song* temp = head;
        int position = 1;
        
        while (temp) {
            string marker = (temp == current) ? "▶️" : "  ";
            cout << "║" << setw(2) << position << " ║ " << marker << " \"" 
                 << left << setw(25) << temp->title << "\" by " 
                 << left << setw(20) << temp->artist;
            
            if (temp == current && isPlaying) {
                cout << " [PLAYING] ";
            } else if (temp == current) {
                cout << " [CURRENT] ";
            } else {
                cout << "           ";
            }
            
            cout << "║\n║   ║    Album: " << left << setw(25) << temp->album 
                 << " | Genre: " << left << setw(10) << temp->genre 
                 << " | " << temp->getFormattedDuration() << "     ║\n";
            
            if (temp->next) {
                cout << "╠═══╬═══════════════════════════════════════════════════════════════════════╣\n";
            }
            
            temp = temp->next;
            position++;
        }
        
        cout << "╚═══╩═══════════════════════════════════════════════════════════════════════╝\n\n";
    }

    void displayCurrentSong() {
        if (!current) {
            cout << "❌ No song currently selected\n";
            return;
        }
        
        cout << "┌─────────────────────────────────────────────────────────┐\n";
        cout << "│ 🎵 NOW " << (isPlaying ? "PLAYING" : "PAUSED") << string(41, ' ') << "│\n";
        cout << "├─────────────────────────────────────────────────────────┤\n";
        cout << "│ Title:  " << left << setw(47) << current->title << "│\n";
        cout << "│ Artist: " << left << setw(47) << current->artist << "│\n";
        cout << "│ Album:  " << left << setw(47) << current->album << "│\n";
        cout << "│ Genre:  " << left << setw(20) << current->genre 
             << "Duration: " << left << setw(15) << current->getFormattedDuration() << "│\n";
        cout << "└─────────────────────────────────────────────────────────┘\n";
    }

    void showNavigationOptions() {
        cout << "\n🎮 Navigation Status:\n";
        cout << "├── Can go Previous: " << (current && current->prev ? "Yes ⏮️" : "No ❌") << "\n";
        cout << "├── Can go Next: " << (current && current->next ? "Yes ⏭️" : "No ❌") << "\n";
        cout << "├── Current Position: ";
        
        if (current) {
            int position = 1;
            Song* temp = head;
            while (temp != current && temp) {
                temp = temp->next;
                position++;
            }
            cout << position << "/" << totalSongs << "\n";
        } else {
            cout << "No song selected\n";
        }
        
        cout << "└── Playback Status: " << (isPlaying ? "Playing ▶️" : "Paused ⏸️") << "\n";
    }

    void showPlaylistStatistics() {
        cout << "\n📊 Playlist Statistics:\n";
        cout << "├── Playlist Name: \"" << playlistName << "\"\n";
        cout << "├── Total Songs: " << totalSongs << "\n";
        cout << "├── Total Duration: " << getFormattedTotalDuration() << "\n";
        cout << "├── Average Song Length: " << getAverageLength() << "\n";
        cout << "├── Genres Present: " << getUniqueGenres() << "\n";
        cout << "├── Memory Usage: ~" << calculateMemoryUsage() << " bytes\n";
        cout << "└── Linked List Depth: " << totalSongs << " nodes\n";
    }

    void showPlayHistory() {
        cout << "\n📜 Play History:\n";
        cout << "┌────┬────────────────────────────────────────────────────────┐\n";
        cout << "│ #  │ Action                                                 │\n";
        cout << "├────┼────────────────────────────────────────────────────────┤\n";
        
        int startIndex = max(0, (int)playHistory.size() - 10); // Show last 10
        
        for (int i = startIndex; i < (int)playHistory.size(); i++) {
            cout << "│ " << left << setw(2) << (i + 1) << " │ " 
                 << left << setw(54) << playHistory[i] << "│\n";
        }
        cout << "└────┴────────────────────────────────────────────────────────┘\n";
    }

    void demonstrateLinkedListConcepts() {
        cout << "\n🎯 Linked List Concepts Demonstrated:\n";
        cout << "• 🔗 Dynamic Memory - nodes allocated as needed\n";
        cout << "• ⬅️➡️ Bidirectional Navigation - prev/next pointers\n";
        cout << "• 📍 Current Pointer - tracks current song position\n";
        cout << "• ➕ O(1) Insertion - at head/tail positions\n";
        cout << "• 🔍 O(n) Search - linear traversal for finding songs\n";
        cout << "• 🧹 Memory Management - dynamic allocation/deallocation\n\n";
        
        cout << "🌍 Real-world Applications:\n";
        cout << "• Music Players (Spotify, Apple Music, YouTube Music)\n";
        cout << "• Photo Galleries (swipe left/right navigation)\n";
        cout << "• Web Browser Tabs (forward/back navigation)\n";
        cout << "• Document Editors (page navigation)\n";
        cout << "• Game Level Progression (previous/next levels)\n";
        cout << "• Social Media Feeds (scroll through posts)\n";
        cout << "• File System Navigation (folder traversal)\n";
    }

private:
    Song* findSong(const string& title) {
        Song* temp = head;
        while (temp) {
            if (temp->title == title) {
                return temp;
            }
            temp = temp->next;
        }
        return nullptr;
    }

    void showPlaylistStatus() {
        cout << "📊 Status: " << totalSongs << " songs | " 
             << getFormattedTotalDuration() << " total\n";
        cout << "────────────────────────────────────────────────────\n";
    }

    string getFormattedTotalDuration() const {
        int hours = totalDuration / 3600;
        int minutes = (totalDuration % 3600) / 60;
        int seconds = totalDuration % 60;
        
        if (hours > 0) {
            return to_string(hours) + "h " + to_string(minutes) + "m " + to_string(seconds) + "s";
        } else {
            return to_string(minutes) + "m " + to_string(seconds) + "s";
        }
    }

    string getAverageLength() const {
        if (totalSongs == 0) return "0:00";
        int avgSeconds = totalDuration / totalSongs;
        int minutes = avgSeconds / 60;
        int seconds = avgSeconds % 60;
        return to_string(minutes) + ":" + (seconds < 10 ? "0" : "") + to_string(seconds);
    }

    int getUniqueGenres() const {
        vector<string> genres;
        Song* temp = head;
        
        while (temp) {
            bool found = false;
            for (const string& genre : genres) {
                if (genre == temp->genre) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                genres.push_back(temp->genre);
            }
            temp = temp->next;
        }
        
        return genres.size();
    }

    size_t calculateMemoryUsage() const {
        return totalSongs * (sizeof(Song) + 100); // Approximate string storage
    }
};

int main() {
    MusicPlaylist playlist("My Awesome Mix");
    
    cout << "🎵 Building your music playlist:\n\n";
    
    // Add a variety of songs
    playlist.addSong("Believer", "Imagine Dragons", "Evolve", 204, "Rock");
    playlist.addSong("Shape of You", "Ed Sheeran", "Divide", 233, "Pop");
    playlist.addSong("Counting Stars", "OneRepublic", "Native", 258, "Pop Rock");
    playlist.addSong("Perfect", "Ed Sheeran", "Divide", 263, "Pop");
    playlist.addSong("Thunder", "Imagine Dragons", "Evolve", 187, "Rock");
    playlist.addSong("Happier", "Marshmello ft. Bastille", "Single", 214, "Electronic");
    
    cout << "\n📋 Complete Playlist:\n";
    playlist.showFullPlaylist();
    
    cout << "🎬 Starting playback demonstration:\n\n";
    
    // Navigation demonstration
    playlist.playFromBeginning();
    cout << "\n";
    
    playlist.playNext();
    cout << "\n";
    
    playlist.playNext();
    cout << "\n";
    
    cout << "⏸️ Pausing playback:\n";
    playlist.pause();
    cout << "\n";
    
    cout << "▶️ Resuming playback:\n";
    playlist.resume();
    cout << "\n";
    
    cout << "⏮️ Going back:\n";
    playlist.playPrevious();
    cout << "\n";
    
    cout << "🎯 Jumping to specific song:\n";
    playlist.jumpToSong("Perfect");
    cout << "\n";
    
    // Show navigation status
    playlist.showNavigationOptions();
    
    // Add more songs
    cout << "\n🎵 Adding more songs to the playlist:\n";
    playlist.addSong("Blinding Lights", "The Weeknd", "After Hours", 200, "Synthpop");
    playlist.addSong("Levitating", "Dua Lipa", "Future Nostalgia", 203, "Disco Pop");
    
    cout << "\n🗑️ Removing a song:\n";
    playlist.removeSong("Thunder");
    
    cout << "\n📋 Updated Playlist:\n";
    playlist.showFullPlaylist();
    
    // Show comprehensive information
    playlist.showPlayHistory();
    playlist.showPlaylistStatistics();
    playlist.demonstrateLinkedListConcepts();
    
    cout << "\nPress any key to continue...";
    cin.get();
    
    return 0;
}