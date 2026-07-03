const testLanguages = async () => {
  const username = 'Akashyatinjain';
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    if (res.status === 200) {
      const repos = await res.json();
      console.log('Total repos fetched:', repos.length);
      
      const langCounts = {};
      let totalWithLanguage = 0;
      
      repos.forEach(repo => {
        if (repo.language) {
          langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
          totalWithLanguage++;
        }
      });
      
      console.log('Language counts:', langCounts);
      console.log('Total with language:', totalWithLanguage);
      
      // Calculate percentages
      const languageColors = {
        JavaScript: '#f7df1e',
        HTML: '#e34f26',
        CSS: '#1572b6',
        EJS: '#a91e50',
        Java: '#b07219',
        Python: '#3572A5',
        TypeScript: '#3178c6',
        C: '#555555',
        'C++': '#f34b7d',
        PHP: '#4F5D95',
        Shell: '#89e051',
      };
      
      const sortedLangs = Object.entries(langCounts)
        .map(([name, count]) => {
          const pct = ((count / totalWithLanguage) * 100).toFixed(2);
          return {
            name,
            pct: `${pct}%`,
            pctVal: parseFloat(pct),
            color: languageColors[name] || '#6e7681'
          };
        })
        .sort((a, b) => b.pctVal - a.pctVal);
        
      console.log('Calculated languages for UI:', sortedLangs);
    } else {
      console.log('Failed to fetch repos:', res.status, await res.text());
    }
  } catch (err) {
    console.error(err);
  }
};

testLanguages();
