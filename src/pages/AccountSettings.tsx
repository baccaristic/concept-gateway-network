
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Save, Key, User as UserIcon, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { userApi } from '@/services/api';

// Define schema for profile update
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  avatarUrl: z.string().optional(),
});

// Define schema for password update
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Current password must be at least 6 characters.",
  }),
  newPassword: z.string().min(6, {
    message: "New password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Confirm password must be at least 6 characters.",
  }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const AccountSettings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  
  // Initialize profile form with user data
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  // Initialize password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Submit profile form
  const onProfileSubmit = async (values: ProfileFormValues) => {
    setIsProfileUpdating(true);
    try {
      const updatedUser = await userApi.updateProfile({
        name: values.name,
        email: values.email,
        avatarUrl: values.avatarUrl
      });
      
      // Update local storage user data
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.name = updatedUser.name;
        userData.email = updatedUser.email;
        userData.avatarUrl = updatedUser.avatarUrl;
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      toast.success(t('settings.profileUpdated'));
    } catch (error) {
      toast.error(`${t('settings.profileUpdateError')}: ${error.message}`);
    } finally {
      setIsProfileUpdating(false);
    }
  };

  // Submit password form
  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setIsPasswordUpdating(true);
    try {
      await userApi.updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success(t('settings.passwordUpdated'));
      passwordForm.reset();
    } catch (error) {
      toast.error(`${t('settings.passwordUpdateError')}: ${error.message}`);
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsAvatarUploading(true);
    try {
      const updatedUser = await userApi.updateAvatar(file);
      
      // Update local storage user data
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.avatarUrl = updatedUser.avatarUrl;
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      // Update form value
      profileForm.setValue('avatarUrl', updatedUser.avatarUrl || '');
      
      toast.success(t('settings.avatarUpdated'));
    } catch (error) {
      toast.error(`${t('settings.avatarUpdateError')}: ${error.message}`);
    } finally {
      setIsAvatarUploading(false);
    }
  };

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout user={user}>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">{t('settings.accountSettings')}</h1>
        
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="profile">{t('settings.profile')}</TabsTrigger>
            <TabsTrigger value="security">{t('settings.security')}</TabsTrigger>
          </TabsList>
          
          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserIcon className="mr-2 h-5 w-5" />
                  {t('settings.profileInformation')}
                </CardTitle>
                <CardDescription>
                  {t('settings.profileDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="text-lg">{getInitials(user.name || 'User')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="relative">
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={isAvatarUploading}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        disabled={isAvatarUploading}
                      >
                        {isAvatarUploading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        {t('settings.changeAvatar')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('settings.fullName')}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('settings.emailAddress')}</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="mt-4"
                          disabled={isProfileUpdating || !profileForm.formState.isDirty}
                        >
                          {isProfileUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {!isProfileUpdating && <Save className="mr-2 h-4 w-4" />}
                          {t('settings.saveChanges')}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  {t('settings.changePassword')}
                </CardTitle>
                <CardDescription>
                  {t('settings.passwordDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('settings.currentPassword')}</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('settings.newPassword')}</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('settings.confirmPassword')}</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="mt-4"
                      disabled={isPasswordUpdating || !passwordForm.formState.isDirty}
                    >
                      {isPasswordUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {!isPasswordUpdating && <Key className="mr-2 h-4 w-4" />}
                      {t('settings.updatePassword')}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AccountSettings;
