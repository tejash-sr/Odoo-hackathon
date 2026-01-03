import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/providers/ThemeProvider';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi! I'm your AI travel assistant. Tell me about your dream trip, and I'll help you plan the perfect itinerary. Where would you like to go?",
    suggestions: [
      '🇯🇵 Plan a trip to Japan',
      '🏖️ Beach vacation ideas',
      '🎒 Budget backpacking trip',
      '💑 Romantic getaway',
    ],
  },
];

export default function AIScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [inputText, setInputText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getAIResponse(text),
      suggestions: getAISuggestions(text),
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsLoading(false);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('japan')) {
      return "Japan is an amazing choice! 🇯🇵 I'd recommend a 10-14 day trip to fully experience it. Here's what I suggest:\n\n📍 **Tokyo** (4-5 days) - Modern city, anime culture, incredible food\n📍 **Kyoto** (3-4 days) - Traditional temples, geishas, bamboo forests\n📍 **Osaka** (2-3 days) - Street food paradise, vibrant nightlife\n\nBest time to visit: Cherry blossom season (late March-April) or autumn (October-November).\n\nShall I create a detailed day-by-day itinerary?";
    }
    
    if (lowerInput.includes('beach') || lowerInput.includes('tropical')) {
      return "I love beach destinations! 🏖️ Here are my top recommendations:\n\n🌴 **Bali, Indonesia** - Perfect for culture + beaches\n🏝️ **Maldives** - Ultimate luxury overwater villas\n🌊 **Thailand** - Phuket, Krabi, Koh Samui\n🐚 **Greece** - Santorini, Mykonos for Instagram-worthy spots\n\nWhat's your vibe - relaxation, adventure, or party?";
    }
    
    if (lowerInput.includes('budget') || lowerInput.includes('cheap')) {
      return "Budget-friendly travel is totally doable! 💰 Here are some amazing destinations that won't break the bank:\n\n🇻🇳 **Vietnam** - $30-50/day including everything\n🇵🇹 **Portugal** - Europe's best value\n🇲🇽 **Mexico** - Great food, beaches, culture\n🇮🇩 **Indonesia** - Beyond Bali, try Yogyakarta\n\nI can help you plan a trip for under $1000. What region interests you most?";
    }
    
    return "That sounds exciting! ✨ I'd love to help you plan this trip. To give you the best recommendations, could you tell me:\n\n1. 📅 When are you planning to travel?\n2. ⏰ How many days do you have?\n3. 💰 What's your approximate budget?\n4. 👥 Who are you traveling with?\n\nWith these details, I can create a personalized itinerary just for you!";
  };

  const getAISuggestions = (input: string): string[] => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('japan')) {
      return [
        '📅 Create 14-day itinerary',
        '🍜 Best ramen spots',
        '🗼 Must-see attractions',
        '💴 Budget breakdown',
      ];
    }
    
    return [
      '📅 Set my travel dates',
      '💰 Help with budget',
      '🎯 Suggest activities',
      '🏨 Find accommodations',
    ];
  };

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
            <Ionicons name="sparkles" size={16} color="#fff" />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser
              ? [styles.userBubble, { backgroundColor: colors.primary }]
              : [styles.aiBubble, { backgroundColor: colors.card }],
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isUser ? '#fff' : colors.text },
            ]}
          >
            {message.content}
          </Text>
        </View>
      </View>
    );
  };

  const renderSuggestions = (suggestions: string[]) => (
    <View style={styles.suggestionsContainer}>
      {suggestions.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.suggestionBtn, { backgroundColor: colors.card }]}
          onPress={() => sendMessage(suggestion)}
        >
          <Text style={[styles.suggestionText, { color: colors.text }]}>
            {suggestion}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <View style={[styles.aiIcon, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="sparkles" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              AI Trip Planner
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
              Powered by GPT-4
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.newChatBtn, { backgroundColor: colors.card }]}
          onPress={() => setMessages(initialMessages)}
        >
          <Ionicons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View key={message.id}>
            {renderMessage(message)}
            {message.suggestions && renderSuggestions(message.suggestions)}
          </View>
        ))}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <View style={[styles.aiAvatar, { backgroundColor: colors.primary }]}>
              <Ionicons name="sparkles" size={16} color="#fff" />
            </View>
            <View style={[styles.loadingBubble, { backgroundColor: colors.card }]}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textMuted }]}>
                Thinking...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Ask me anything about your trip..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              { backgroundColor: inputText.trim() ? colors.primary : colors.border },
            ]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? '#fff' : colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 13,
  },
  newChatBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginLeft: 40,
    marginBottom: 16,
  },
  suggestionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  loadingText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
