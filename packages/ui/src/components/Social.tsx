import * as React from 'react';
import { cn } from '../lib/utils';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Avatar, AvatarGroup } from './Avatar';
import {
  MessageCircle,
  Users,
  UserPlus,
  Share2,
  Heart,
  Send,
  Image,
  MapPin,
  Calendar,
  Clock,
  MoreHorizontal,
  Reply,
  Bookmark,
  Globe,
  Lock,
  ChevronRight,
  Star,
  ThumbsUp,
  Eye,
  Link2,
  Facebook,
  Twitter,
  Copy,
  Mail,
} from 'lucide-react';

// Trip Post Card (Social Feed)
export interface TripPostProps {
  id: string;
  author: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  trip: {
    name: string;
    destination: string;
    image?: string;
  };
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  timestamp: Date;
  visibility?: 'public' | 'friends' | 'private';
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onClick?: () => void;
  className?: string;
}

export function TripPost({
  author,
  trip,
  content,
  images = [],
  likes,
  comments,
  shares,
  isLiked = false,
  isBookmarked = false,
  timestamp,
  visibility = 'public',
  onLike,
  onComment,
  onShare,
  onBookmark,
  onClick,
  className,
}: TripPostProps) {
  const timeAgo = getTimeAgo(timestamp);
  const VisibilityIcon = visibility === 'public' ? Globe : visibility === 'friends' ? Users : Lock;

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Avatar src={author.avatar} name={author.name} size="md" />
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {author.name}
            </span>
            {author.verified && (
              <span className="text-primary-500">✓</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>{timeAgo}</span>
            <span>•</span>
            <VisibilityIcon className="h-3 w-3" />
          </div>
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-600">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-slate-700 dark:text-slate-300">{content}</p>
        <div className="mt-2 flex items-center gap-2 text-sm text-primary-600">
          <MapPin className="h-4 w-4" />
          <span>{trip.destination}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">{trip.name}</span>
        </div>
      </div>

      {/* Images */}
      {images.length > 0 && (
        <div
          className={cn(
            'grid gap-1',
            images.length === 1 && 'grid-cols-1',
            images.length === 2 && 'grid-cols-2',
            images.length >= 3 && 'grid-cols-3'
          )}
        >
          {images.slice(0, 3).map((img, i) => (
            <div
              key={i}
              className={cn(
                'relative aspect-[4/3] overflow-hidden',
                images.length === 1 && 'aspect-video',
                i === 0 && images.length === 3 && 'col-span-2 row-span-2'
              )}
            >
              <img
                src={img}
                alt=""
                className="h-full w-full object-cover"
              />
              {i === 2 && images.length > 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-2xl font-bold text-white">
                    +{images.length - 3}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between border-y border-slate-200 px-4 py-2 text-sm text-slate-500 dark:border-slate-700">
        <span>{likes.toLocaleString()} likes</span>
        <div className="flex gap-3">
          <span>{comments.toLocaleString()} comments</span>
          <span>{shares.toLocaleString()} shares</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-around p-2">
        <button
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-lg py-2 transition-colors',
            isLiked
              ? 'text-red-500'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
          onClick={onLike}
        >
          <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
          <span>Like</span>
        </button>
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onComment}
        >
          <MessageCircle className="h-5 w-5" />
          <span>Comment</span>
        </button>
        <button
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onShare}
        >
          <Share2 className="h-5 w-5" />
          <span>Share</span>
        </button>
        <button
          className={cn(
            'flex items-center justify-center rounded-lg p-2 transition-colors',
            isBookmarked
              ? 'text-amber-500'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
          onClick={onBookmark}
        >
          <Bookmark className={cn('h-5 w-5', isBookmarked && 'fill-current')} />
        </button>
      </div>
    </Card>
  );
}

// Travel Companion Card
export interface TravelCompanionProps {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  tripsCount?: number;
  mutualFriends?: number;
  interests?: string[];
  isConnected?: boolean;
  isPending?: boolean;
  onConnect?: () => void;
  onMessage?: () => void;
  onClick?: () => void;
  className?: string;
}

export function TravelCompanionCard({
  name,
  avatar,
  bio,
  location,
  tripsCount,
  mutualFriends,
  interests = [],
  isConnected = false,
  isPending = false,
  onConnect,
  onMessage,
  onClick,
  className,
}: TravelCompanionProps) {
  return (
    <Card
      variant={onClick ? 'interactive' : 'default'}
      className={className}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <Avatar src={avatar} name={name} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            {name}
          </h3>
          {location && (
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3 w-3" />
              {location}
            </div>
          )}
          {bio && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {bio}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
        {tripsCount !== undefined && (
          <span>{tripsCount} trips</span>
        )}
        {mutualFriends !== undefined && mutualFriends > 0 && (
          <span>{mutualFriends} mutual friends</span>
        )}
      </div>

      {interests.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {interests.slice(0, 4).map((interest, i) => (
            <Badge key={i} variant="secondary" size="sm">
              {interest}
            </Badge>
          ))}
          {interests.length > 4 && (
            <Badge variant="secondary" size="sm">
              +{interests.length - 4}
            </Badge>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {isConnected ? (
          <Button variant="secondary" className="flex-1" onClick={onMessage}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
          </Button>
        ) : isPending ? (
          <Button variant="secondary" className="flex-1" disabled>
            <Clock className="mr-2 h-4 w-4" />
            Pending
          </Button>
        ) : (
          <Button variant="primary" className="flex-1" onClick={onConnect}>
            <UserPlus className="mr-2 h-4 w-4" />
            Connect
          </Button>
        )}
      </div>
    </Card>
  );
}

// Trip Group Card
export interface TripGroupProps {
  id: string;
  name: string;
  image?: string;
  members: Array<{ name: string; avatar?: string }>;
  memberCount: number;
  trip?: string;
  destination?: string;
  isJoined?: boolean;
  onJoin?: () => void;
  onClick?: () => void;
  className?: string;
}

export function TripGroupCard({
  name,
  image,
  members,
  memberCount,
  trip,
  destination,
  isJoined = false,
  onJoin,
  onClick,
  className,
}: TripGroupProps) {
  return (
    <Card
      variant={onClick ? 'interactive' : 'default'}
      padding="none"
      className={cn('overflow-hidden', className)}
      onClick={onClick}
    >
      {image && (
        <div className="aspect-[3/1] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <CardContent className="p-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {name}
        </h3>
        {(trip || destination) && (
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            {destination && (
              <>
                <MapPin className="h-3 w-3" />
                <span>{destination}</span>
              </>
            )}
            {trip && (
              <>
                {destination && <span>•</span>}
                <span>{trip}</span>
              </>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AvatarGroup max={3}>
              {members.slice(0, 3).map((member, i) => (
                <Avatar
                  key={i}
                  src={member.avatar}
                  name={member.name}
                  size="sm"
                />
              ))}
            </AvatarGroup>
            <span className="text-sm text-slate-500">
              {memberCount} members
            </span>
          </div>

          {onJoin && (
            <Button
              variant={isJoined ? 'secondary' : 'primary'}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onJoin();
              }}
            >
              {isJoined ? 'Joined' : 'Join'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Share Sheet
export interface ShareSheetProps {
  title?: string;
  url: string;
  message?: string;
  onShare?: (platform: string) => void;
  onCopy?: () => void;
  className?: string;
}

export function ShareSheet({
  title = 'Share',
  url,
  message,
  onShare,
  onCopy,
  className,
}: ShareSheetProps) {
  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
    { id: 'email', name: 'Email', icon: Mail, color: 'bg-slate-600' },
    { id: 'link', name: 'Copy Link', icon: Link2, color: 'bg-slate-500' },
  ];

  return (
    <Card className={className}>
      <h3 className="mb-4 text-center font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>

      <div className="grid grid-cols-4 gap-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <button
              key={platform.id}
              className="flex flex-col items-center gap-2"
              onClick={() =>
                platform.id === 'link' ? onCopy?.() : onShare?.(platform.id)
              }
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full text-white',
                  platform.color
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {platform.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
        <input
          type="text"
          value={url}
          readOnly
          className="flex-1 bg-transparent text-sm text-slate-600 outline-none dark:text-slate-400"
        />
        <Button variant="secondary" size="sm" onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

// Comment Component
export interface CommentProps {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  likes?: number;
  isLiked?: boolean;
  replies?: CommentProps[];
  onLike?: () => void;
  onReply?: () => void;
  className?: string;
}

export function Comment({
  author,
  content,
  timestamp,
  likes = 0,
  isLiked = false,
  replies = [],
  onLike,
  onReply,
  className,
}: CommentProps) {
  const timeAgo = getTimeAgo(timestamp);

  return (
    <div className={cn('', className)}>
      <div className="flex gap-3">
        <Avatar src={author.avatar} name={author.name} size="sm" />
        <div className="flex-1">
          <div className="rounded-2xl bg-slate-100 px-4 py-2 dark:bg-slate-800">
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {author.name}
            </span>
            <p className="text-slate-700 dark:text-slate-300">{content}</p>
          </div>
          <div className="mt-1 flex items-center gap-4 text-xs">
            <span className="text-slate-500">{timeAgo}</span>
            <button
              className={cn(
                'font-medium',
                isLiked ? 'text-red-500' : 'text-slate-500 hover:text-slate-700'
              )}
              onClick={onLike}
            >
              Like {likes > 0 && `(${likes})`}
            </button>
            <button
              className="font-medium text-slate-500 hover:text-slate-700"
              onClick={onReply}
            >
              Reply
            </button>
          </div>
        </div>
      </div>

      {replies.length > 0 && (
        <div className="ml-10 mt-3 space-y-3">
          {replies.map((reply) => (
            <Comment key={reply.id} {...reply} />
          ))}
        </div>
      )}
    </div>
  );
}

// Comment Input
export interface CommentInputProps {
  avatar?: string;
  name?: string;
  placeholder?: string;
  onSubmit?: (content: string) => void;
  className?: string;
}

export function CommentInput({
  avatar,
  name,
  placeholder = 'Write a comment...',
  onSubmit,
  className,
}: CommentInputProps) {
  const [value, setValue] = React.useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit?.(value.trim());
      setValue('');
    }
  };

  return (
    <div className={cn('flex gap-3', className)}>
      <Avatar src={avatar} name={name || 'You'} size="sm" />
      <div className="flex flex-1 items-center gap-2 rounded-full bg-slate-100 px-4 py-2 dark:bg-slate-800">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button className="text-slate-400 hover:text-slate-600">
          <Image className="h-5 w-5" />
        </button>
        <button
          className={cn(
            'transition-colors',
            value.trim()
              ? 'text-primary-500 hover:text-primary-600'
              : 'text-slate-300'
          )}
          onClick={handleSubmit}
          disabled={!value.trim()}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// Helper function
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString();
}
