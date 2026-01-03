'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Smartphone,
  Mail,
  MessageSquare,
  Volume2,
  Eye,
  Key,
  Fingerprint,
  Download,
  Trash2,
  ExternalLink,
  Check,
} from 'lucide-react';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const sections: SettingSection[] = [
  { id: 'account', title: 'Account', icon: <User className="w-5 h-5" />, description: 'Profile and personal info' },
  { id: 'notifications', title: 'Notifications', icon: <Bell className="w-5 h-5" />, description: 'Email and push alerts' },
  { id: 'privacy', title: 'Privacy & Security', icon: <Shield className="w-5 h-5" />, description: 'Data and security settings' },
  { id: 'appearance', title: 'Appearance', icon: <Palette className="w-5 h-5" />, description: 'Theme and display' },
  { id: 'language', title: 'Language & Region', icon: <Globe className="w-5 h-5" />, description: 'Language and units' },
  { id: 'billing', title: 'Billing & Plans', icon: <CreditCard className="w-5 h-5" />, description: 'Subscription and payments' },
  { id: 'help', title: 'Help & Support', icon: <HelpCircle className="w-5 h-5" />, description: 'Get help and feedback' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    tripReminders: true,
    priceAlerts: true,
    newsletter: false,
    soundEffects: true,
    profileVisibility: 'friends',
    twoFactorEnabled: false,
    biometricEnabled: true,
    language: 'en',
    currency: 'USD',
    distanceUnit: 'miles',
    temperatureUnit: 'fahrenheit',
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-indigo-200 mt-1">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <nav className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-600'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-l-4 border-transparent'
                  }`}
                >
                  <span className={activeSection === section.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>
                    {section.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{section.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{section.description}</p>
                  </div>
                </button>
              ))}
              
              {/* Sign Out */}
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-slate-200 dark:border-slate-700">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Account Section */}
              {activeSection === 'account' && (
                <>
                  <SettingCard title="Profile Information">
                    <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
                        T
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Tejash</h3>
                        <p className="text-slate-500 text-sm">demo@globetrotter.app</p>
                        <p className="text-xs text-slate-400 mt-1">Member since January 2026</p>
                      </div>
                      <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                        Edit Profile
                      </button>
                    </div>
                    <SettingRow label="Full Name" value="Tejash" action="Edit" />
                    <SettingRow label="Email Address" value="demo@globetrotter.app" action="Change" />
                    <SettingRow label="Phone Number" value="123" action="Edit" />
                    <SettingRow label="Date of Birth" value="January 15, 1990" action="Edit" />
                  </SettingCard>

                  <SettingCard title="Connected Accounts">
                    <ConnectedAccount provider="Google" connected email="demo@globetrotter.app" />
                    <ConnectedAccount provider="Apple" connected={false} />
                    <ConnectedAccount provider="Facebook" connected={false} />
                  </SettingCard>

                  <SettingCard title="Data & Privacy">
                    <button className="flex items-center gap-3 w-full py-3 text-left text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <Download className="w-5 h-5" />
                      <span>Download Your Data</span>
                      <ChevronRight className="w-5 h-5 ml-auto text-slate-400" />
                    </button>
                    <button className="flex items-center gap-3 w-full py-3 text-left text-red-600 hover:text-red-700 transition-colors border-t border-slate-200 dark:border-slate-700">
                      <Trash2 className="w-5 h-5" />
                      <span>Delete Account</span>
                      <ChevronRight className="w-5 h-5 ml-auto" />
                    </button>
                  </SettingCard>
                </>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <>
                  <SettingCard title="Email Notifications">
                    <ToggleSetting
                      icon={<Mail className="w-5 h-5" />}
                      label="Email Notifications"
                      description="Receive email updates about your trips"
                      enabled={settings.emailNotifications}
                      onToggle={() => handleToggle('emailNotifications')}
                    />
                    <ToggleSetting
                      icon={<MessageSquare className="w-5 h-5" />}
                      label="Newsletter"
                      description="Travel tips and destination inspiration"
                      enabled={settings.newsletter}
                      onToggle={() => handleToggle('newsletter')}
                    />
                  </SettingCard>

                  <SettingCard title="Push Notifications">
                    <ToggleSetting
                      icon={<Smartphone className="w-5 h-5" />}
                      label="Push Notifications"
                      description="Receive notifications on your device"
                      enabled={settings.pushNotifications}
                      onToggle={() => handleToggle('pushNotifications')}
                    />
                    <ToggleSetting
                      icon={<Bell className="w-5 h-5" />}
                      label="Trip Reminders"
                      description="Get reminded about upcoming trips"
                      enabled={settings.tripReminders}
                      onToggle={() => handleToggle('tripReminders')}
                    />
                    <ToggleSetting
                      icon={<CreditCard className="w-5 h-5" />}
                      label="Price Alerts"
                      description="Notifications about price changes"
                      enabled={settings.priceAlerts}
                      onToggle={() => handleToggle('priceAlerts')}
                    />
                  </SettingCard>

                  <SettingCard title="Sound & Haptics">
                    <ToggleSetting
                      icon={<Volume2 className="w-5 h-5" />}
                      label="Sound Effects"
                      description="Play sounds for notifications"
                      enabled={settings.soundEffects}
                      onToggle={() => handleToggle('soundEffects')}
                    />
                  </SettingCard>
                </>
              )}

              {/* Privacy & Security Section */}
              {activeSection === 'privacy' && (
                <>
                  <SettingCard title="Security">
                    <ToggleSetting
                      icon={<Key className="w-5 h-5" />}
                      label="Two-Factor Authentication"
                      description="Add an extra layer of security"
                      enabled={settings.twoFactorEnabled}
                      onToggle={() => handleToggle('twoFactorEnabled')}
                    />
                    <ToggleSetting
                      icon={<Fingerprint className="w-5 h-5" />}
                      label="Biometric Login"
                      description="Use Face ID or fingerprint to sign in"
                      enabled={settings.biometricEnabled}
                      onToggle={() => handleToggle('biometricEnabled')}
                    />
                    <SettingRow label="Password" value="Last changed 30 days ago" action="Change" />
                  </SettingCard>

                  <SettingCard title="Privacy">
                    <SelectSetting
                      icon={<Eye className="w-5 h-5" />}
                      label="Profile Visibility"
                      value={settings.profileVisibility}
                      options={[
                        { value: 'public', label: 'Public' },
                        { value: 'friends', label: 'Friends Only' },
                        { value: 'private', label: 'Private' },
                      ]}
                      onChange={(value) => setSettings(prev => ({ ...prev, profileVisibility: value }))}
                    />
                  </SettingCard>

                  <SettingCard title="Sessions">
                    <div className="py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Chrome on Windows</p>
                          <p className="text-sm text-slate-500">Current session • Active now</p>
                        </div>
                        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full">
                          This device
                        </span>
                      </div>
                    </div>
                    <div className="py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Safari on iPhone</p>
                          <p className="text-sm text-slate-500">Last active 2 hours ago</p>
                        </div>
                        <button className="text-red-600 text-sm font-medium hover:text-red-700">
                          Revoke
                        </button>
                      </div>
                    </div>
                    <button className="w-full py-3 text-center text-red-600 font-medium hover:text-red-700 transition-colors">
                      Sign Out All Devices
                    </button>
                  </SettingCard>
                </>
              )}

              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <>
                  <SettingCard title="Theme">
                    <div className="grid grid-cols-3 gap-4">
                      {(['light', 'dark', 'system'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            theme === t
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            {t === 'light' && <Sun className="w-6 h-6 text-amber-500" />}
                            {t === 'dark' && <Moon className="w-6 h-6 text-indigo-400" />}
                            {t === 'system' && <Smartphone className="w-6 h-6 text-slate-500" />}
                            <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
                              {t}
                            </span>
                          </div>
                          {theme === t && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </SettingCard>
                </>
              )}

              {/* Language & Region Section */}
              {activeSection === 'language' && (
                <>
                  <SettingCard title="Language & Region">
                    <SelectSetting
                      icon={<Globe className="w-5 h-5" />}
                      label="Language"
                      value={settings.language}
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Spanish' },
                        { value: 'fr', label: 'French' },
                        { value: 'de', label: 'German' },
                        { value: 'ja', label: 'Japanese' },
                      ]}
                      onChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                    />
                    <SelectSetting
                      icon={<CreditCard className="w-5 h-5" />}
                      label="Currency"
                      value={settings.currency}
                      options={[
                        { value: 'USD', label: 'USD ($)' },
                        { value: 'EUR', label: 'EUR (€)' },
                        { value: 'GBP', label: 'GBP (£)' },
                        { value: 'JPY', label: 'JPY (¥)' },
                      ]}
                      onChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}
                    />
                  </SettingCard>

                  <SettingCard title="Units">
                    <SelectSetting
                      label="Distance"
                      value={settings.distanceUnit}
                      options={[
                        { value: 'miles', label: 'Miles' },
                        { value: 'km', label: 'Kilometers' },
                      ]}
                      onChange={(value) => setSettings(prev => ({ ...prev, distanceUnit: value }))}
                    />
                    <SelectSetting
                      label="Temperature"
                      value={settings.temperatureUnit}
                      options={[
                        { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
                        { value: 'celsius', label: 'Celsius (°C)' },
                      ]}
                      onChange={(value) => setSettings(prev => ({ ...prev, temperatureUnit: value }))}
                    />
                  </SettingCard>
                </>
              )}

              {/* Billing Section */}
              {activeSection === 'billing' && (
                <>
                  <SettingCard title="Current Plan">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl text-white">
                      <div>
                        <p className="text-sm text-indigo-100">Current Plan</p>
                        <p className="text-2xl font-bold">Free</p>
                        <p className="text-sm text-indigo-200 mt-1">Basic features included</p>
                      </div>
                      <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                        Upgrade
                      </button>
                    </div>
                  </SettingCard>

                  <SettingCard title="Usage">
                    <div className="space-y-4">
                      <UsageBar label="Trips" used={3} total={5} />
                      <UsageBar label="Documents" used={12} total={20} />
                      <UsageBar label="Storage" used={50} total={100} unit="MB" />
                    </div>
                  </SettingCard>

                  <SettingCard title="Payment Methods">
                    <p className="text-slate-500 py-4 text-center">No payment methods added</p>
                    <button className="w-full py-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
                      + Add Payment Method
                    </button>
                  </SettingCard>
                </>
              )}

              {/* Help Section */}
              {activeSection === 'help' && (
                <>
                  <SettingCard title="Support">
                    <LinkRow icon={<HelpCircle className="w-5 h-5" />} label="Help Center" href="/help" />
                    <LinkRow icon={<MessageSquare className="w-5 h-5" />} label="Contact Support" href="/support" />
                    <LinkRow icon={<ExternalLink className="w-5 h-5" />} label="Community Forum" href="https://community.globetrotter.app" external />
                  </SettingCard>

                  <SettingCard title="About">
                    <SettingRow label="App Version" value="1.0.0" />
                    <LinkRow label="Terms of Service" href="/terms" />
                    <LinkRow label="Privacy Policy" href="/privacy" />
                    <LinkRow label="Licenses" href="/licenses" />
                  </SettingCard>
                </>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

function SettingCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
      </div>
      <div className="px-6 py-2">{children}</div>
    </div>
  );
}

function SettingRow({ label, value, action }: { label: string; value: string; action?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="font-medium text-slate-900 dark:text-white">{value}</p>
      </div>
      {action && (
        <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">{action}</button>
      )}
    </div>
  );
}

function ToggleSetting({
  icon,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <div className="flex items-center gap-3">
        {icon && <span className="text-slate-400">{icon}</span>}
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{label}</p>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          enabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            enabled ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  );
}

function SelectSetting({
  icon,
  label,
  value,
  options,
  onChange,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <div className="flex items-center gap-3">
        {icon && <span className="text-slate-400">{icon}</span>}
        <p className="font-medium text-slate-900 dark:text-white">{label}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 bg-slate-100 dark:bg-slate-700 border-0 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ConnectedAccount({
  provider,
  connected,
  email,
}: {
  provider: string;
  connected: boolean;
  email?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
          {provider === 'Google' && (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          {provider === 'Apple' && (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          )}
          {provider === 'Facebook' && (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
        </div>
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{provider}</p>
          {connected && email && <p className="text-sm text-slate-500">{email}</p>}
        </div>
      </div>
      <button
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          connected
            ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50'
            : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
        }`}
      >
        {connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}

function LinkRow({
  icon,
  label,
  href,
  external,
}: {
  icon?: React.ReactNode;
  label: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-3 py-3 border-b border-slate-200 dark:border-slate-700 last:border-0 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
    >
      {icon && <span className="text-slate-400">{icon}</span>}
      <span className="flex-1 font-medium">{label}</span>
      {external && <ExternalLink className="w-4 h-4 text-slate-400" />}
      <ChevronRight className="w-5 h-5 text-slate-400" />
    </a>
  );
}

function UsageBar({
  label,
  used,
  total,
  unit = '',
}: {
  label: string;
  used: number;
  total: number;
  unit?: string;
}) {
  const percentage = (used / total) * 100;
  const isWarning = percentage > 80;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        <span className={`text-sm ${isWarning ? 'text-orange-500' : 'text-slate-500'}`}>
          {used}{unit} / {total}{unit}
        </span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isWarning ? 'bg-orange-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
