import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Share2, Download, Link, Share, Users, Heart, CheckCircle, Lightbulb } from 'lucide-react';

interface RecipeExport {
  title: string;
  ingredients: Record<string, number>;
  volume: string;
  mode: string;
  exportDate: string;
}

interface ActionsPanelProps {
  exportRecipe: () => RecipeExport;
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
  const { data: counterData } = useQuery<{ count: number }>({
    queryKey: ['/api/gazpacho/counter'],
    staleTime: 30000,
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
    },
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
    } catch (_error) {
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
    } catch (_error) {
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
          title: "Juanje's Golden Gazpacho Recipe",
          text: text,
          url: window.location.href,
        });
      } catch (_error) {
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
      <Card className="border-2 border-parchment-300 bg-parchment-100 shadow-lg dark:border-ancient-600 dark:bg-ancient-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-playfair text-2xl font-semibold text-ancient-700 dark:text-parchment-100">
            <Share2 className="h-6 w-6 text-parchment-500" />
            {t('share_export')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleExportRecipe}
            className="w-full transform bg-gradient-to-r from-parchment-400 to-parchment-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
            data-testid="export-recipe-button"
          >
            <Download className="mr-2 h-4 w-4" />
            {t('export_recipe')}
          </Button>
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="w-full transform border border-parchment-300 bg-parchment-200 text-ancient-700 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg dark:border-ancient-600 dark:bg-ancient-700 dark:text-parchment-200"
            data-testid="copy-link-button"
          >
            <Link className="mr-2 h-4 w-4" />
            {t('copy_link')}
          </Button>
          <Button
            onClick={handleShareSocial}
            variant="outline"
            className="w-full transform border border-parchment-300 bg-parchment-200 text-ancient-700 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg dark:border-ancient-600 dark:bg-ancient-700 dark:text-parchment-200"
            data-testid="share-social-button"
          >
            <Share className="mr-2 h-4 w-4" />
            {t('share_social')}
          </Button>
        </CardContent>
      </Card>

      {/* Made It Counter */}
      <Card className="border-2 border-parchment-400 bg-gradient-to-br from-parchment-200 to-parchment-300 shadow-lg dark:border-ancient-500 dark:from-ancient-700 dark:to-ancient-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-playfair text-2xl font-semibold text-ancient-700 dark:text-parchment-100">
            <Users className="h-6 w-6 text-parchment-500" />
            {t('community')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div
            className="mb-2 text-4xl font-bold text-parchment-600 dark:text-parchment-300"
            data-testid="made-counter"
          >
            {counterData?.count?.toLocaleString() || '2,847'}
          </div>
          <p className="font-inter mb-4 text-ancient-600 dark:text-parchment-200">
            {t('people_made')}
          </p>
          <Button
            onClick={handleMadeIt}
            disabled={userHasMadeIt || incrementMutation.isPending}
            className={`font-inter w-full transform rounded-xl px-6 py-4 text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              userHasMadeIt
                ? 'cursor-not-allowed bg-gray-400 text-gray-600'
                : 'bg-gradient-to-r from-parchment-500 to-parchment-600 text-white'
            }`}
            data-testid="made-it-button"
          >
            {userHasMadeIt ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                {t('already_made')}
              </>
            ) : (
              <>
                <Heart className="mr-2 h-5 w-5" />
                {t('i_made_it')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Traditional Tips */}
      <Card className="border-2 border-parchment-300 bg-parchment-100 shadow-lg dark:border-ancient-600 dark:bg-ancient-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-playfair text-2xl font-semibold text-ancient-700 dark:text-parchment-100">
            <Lightbulb className="h-6 w-6 text-parchment-500" />
            {t('traditional_tips')}
          </CardTitle>
        </CardHeader>
        <CardContent className="font-inter space-y-3 text-sm text-ancient-600 dark:text-parchment-300">
          {['tip1', 'tip2', 'tip3', 'tip4'].map((tip) => (
            <div key={tip} className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-parchment-500" />
              <p>{t(tip)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
