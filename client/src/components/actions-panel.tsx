import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Share2, 
  Download, 
  Link, 
  Share, 
  Users, 
  Heart, 
  CheckCircle, 
  Lightbulb 
} from 'lucide-react';

interface ActionsPanelProps {
  exportRecipe: () => any;
  t: (key: string) => string;
}

export function ActionsPanel({ exportRecipe, t }: ActionsPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userHasMadeIt, setUserHasMadeIt] = useState(false);

  // Check if user has already made it
  useEffect(() => {
    const hasMade = localStorage.getItem('gazpacho-user-made') === 'true';
    setUserHasMadeIt(hasMade);
  }, []);

  // Fetch counter data
  const { data: counterData } = useQuery({
    queryKey: ['/api/gazpacho/counter'],
    staleTime: 30000, // 30 seconds
  });

  // Increment counter mutation
  const incrementMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/gazpacho/counter/increment'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gazpacho/counter'] });
      localStorage.setItem('gazpacho-user-made', 'true');
      setUserHasMadeIt(true);
      toast({
        title: t('made_it_thanks'),
        description: '',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update counter',
        variant: 'destructive',
      });
    }
  });

  const handleExportRecipe = () => {
    try {
      const recipeData = exportRecipe();
      const dataStr = JSON.stringify(recipeData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = 'juanje-gazpacho-recipe.json';
      link.click();
      
      toast({
        title: t('export_success'),
        description: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export recipe',
        variant: 'destructive',
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast({
        title: t('link_copied'),
        description: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive',
      });
    }
  };

  const handleShareSocial = async () => {
    const text = `Check out this amazing Gazpacho recipe! ${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Juanje\'s Golden Gazpacho Recipe',
          text: text,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      toast({
        title: t('share_not_supported'),
        description: '',
      });
    }
  };

  const handleMadeIt = () => {
    if (!userHasMadeIt) {
      incrementMutation.mutate();
    } else {
      toast({
        title: t('already_marked'),
        description: '',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Export & Share */}
      <Card className="bg-parchment-100 dark:bg-ancient-800 border-2 border-parchment-300 dark:border-ancient-600 shadow-lg">
        <CardHeader>
          <CardTitle className="font-playfair text-2xl font-semibold text-ancient-700 dark:text-parchment-100 flex items-center gap-2">
            <Share2 className="h-6 w-6 text-parchment-500" />
            {t('share_export')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleExportRecipe}
            className="w-full bg-gradient-to-r from-parchment-400 to-parchment-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            data-testid="export-recipe-button"
          >
            <Download className="w-4 h-4 mr-2" />
            {t('export_recipe')}
          </Button>
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="w-full bg-parchment-200 dark:bg-ancient-700 text-ancient-700 dark:text-parchment-200 border border-parchment-300 dark:border-ancient-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            data-testid="copy-link-button"
          >
            <Link className="w-4 h-4 mr-2" />
            {t('copy_link')}
          </Button>
          <Button
            onClick={handleShareSocial}
            variant="outline"
            className="w-full bg-parchment-200 dark:bg-ancient-700 text-ancient-700 dark:text-parchment-200 border border-parchment-300 dark:border-ancient-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            data-testid="share-social-button"
          >
            <Share className="w-4 h-4 mr-2" />
            {t('share_social')}
          </Button>
        </CardContent>
      </Card>

      {/* Made It Counter */}
      <Card className="bg-gradient-to-br from-parchment-200 to-parchment-300 dark:from-ancient-700 dark:to-ancient-600 border-2 border-parchment-400 dark:border-ancient-500 shadow-lg">
        <CardHeader>
          <CardTitle className="font-playfair text-2xl font-semibold text-ancient-700 dark:text-parchment-100 flex items-center gap-2">
            <Users className="h-6 w-6 text-parchment-500" />
            {t('community')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div 
            className="text-4xl font-bold text-parchment-600 dark:text-parchment-300 mb-2"
            data-testid="made-counter"
          >
            {counterData?.count?.toLocaleString() || '2,847'}
          </div>
          <p className="text-ancient-600 dark:text-parchment-200 font-inter mb-4">
            {t('people_made')}
          </p>
          <Button
            onClick={handleMadeIt}
            disabled={userHasMadeIt || incrementMutation.isPending}
            className={`w-full px-6 py-4 rounded-xl font-inter font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
              userHasMadeIt
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-parchment-500 to-parchment-600 text-white'
            }`}
            data-testid="made-it-button"
          >
            {userHasMadeIt ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                {t('already_made')}
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 mr-2" />
                {t('i_made_it')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Traditional Tips */}
      <Card className="bg-parchment-100 dark:bg-ancient-800 border-2 border-parchment-300 dark:border-ancient-600 shadow-lg">
        <CardHeader>
          <CardTitle className="font-playfair text-2xl font-semibold text-ancient-700 dark:text-parchment-100 flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-parchment-500" />
            {t('traditional_tips')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-ancient-600 dark:text-parchment-300 font-inter text-sm">
          {['tip1', 'tip2', 'tip3', 'tip4'].map((tip) => (
            <div key={tip} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-parchment-500 mt-0.5 flex-shrink-0" />
              <p>{t(tip)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
