import { useMemo } from 'react';
import Message from './Message';
import AdBanner from './AdBanner';

// Helper function to group messages
const groupMessages = (messages) => {
    const groups = [];
    let currentGroup = [];
    let messageCount = 0;

    messages.forEach((message) => {
        messageCount++;
        currentGroup.push(message);

        // Start a new group after every 4 messages
        if (messageCount % 4 === 0) {
            groups.push([...currentGroup]);
            currentGroup = [];
        }
    });

    // Add any remaining messages
    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }

    return groups;
};

export default function MessageGroup({ messages, completion }) {
    const messageGroups = useMemo(() => groupMessages(messages), [messages]);

    // Extract topics or keywords from the last few messages for ad context
    const getMessageContext = (messages) => {
        return messages
            .slice(-2)
            .map(msg => msg.text)
            .join(' ');
    };

    // Don't render anything if there are no messages and no completion
    if (messages.length === 0 && !completion) {
        return null;
    }

    return (
        <div>
            {messageGroups.map((group, groupIndex) => (
                <div key={`group-${groupIndex}`}>
                    {group.map((message, index) => (
                        <Message
                            key={`message-${groupIndex}-${index}`}
                            message={message.text}
                            isUser={message.isUser}
                        />
                    ))}
                    {/* Show ad after each group except the last one */}
                    {groupIndex < messageGroups.length - 1 && (
                        <AdBanner messageContext={getMessageContext(group)} />
                    )}
                </div>
            ))}
            {/* Only show completion if we have messages */}
            {messages.length > 0 && completion && (
                <Message message={completion} isUser={false} />
            )}
        </div>
    );
} 