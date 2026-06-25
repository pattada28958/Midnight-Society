$apiKey = "d05521f5c71cc160d76bbb403a460e61"

$franchises = @(
    @{
        id = "conjuring"
        backdrop_search = "The Conjuring"
        movies = @(
            @{ idx = 0; query = "The Conjuring"; year = 2013 }
            @{ idx = 1; query = "Annabelle"; year = 2014 }
            @{ idx = 2; query = "The Conjuring 2"; year = 2016 }
            @{ idx = 3; query = "Annabelle: Creation"; year = 2017 }
            @{ idx = 4; query = "The Nun"; year = 2018 }
            @{ idx = 5; query = "Annabelle Comes Home"; year = 2019 }
            @{ idx = 6; query = "The Conjuring: The Devil Made Me Do It"; year = 2021 }
            @{ idx = 7; query = "The Nun II"; year = 2023 }
        )
    },
    @{
        id = "saw"
        backdrop_search = "Saw"
        movies = @(
            @{ idx = 0; query = "Saw"; year = 2004 }
            @{ idx = 1; query = "Saw II"; year = 2005 }
            @{ idx = 2; query = "Saw III"; year = 2006 }
            @{ idx = 3; query = "Saw IV"; year = 2007 }
            @{ idx = 4; query = "Saw V"; year = 2008 }
            @{ idx = 5; query = "Saw VI"; year = 2009 }
            @{ idx = 6; query = "Saw 3D"; year = 2010 }
            @{ idx = 7; query = "Jigsaw"; year = 2017 }
            @{ idx = 8; query = "Spiral: From the Book of Saw"; year = 2021 }
            @{ idx = 9; query = "Saw X"; year = 2023 }
        )
    },
    @{
        id = "insidious"
        backdrop_search = "Insidious"
        movies = @(
            @{ idx = 0; query = "Insidious"; year = 2010 }
            @{ idx = 1; query = "Insidious: Chapter 2"; year = 2013 }
            @{ idx = 2; query = "Insidious: Chapter 3"; year = 2015 }
            @{ idx = 3; query = "Insidious: The Last Key"; year = 2018 }
            @{ idx = 4; query = "Insidious: The Red Door"; year = 2023 }
        )
    },
    @{
        id = "paranormal"
        backdrop_search = "Paranormal Activity"
        movies = @(
            @{ idx = 0; query = "Paranormal Activity"; year = 2007 }
            @{ idx = 1; query = "Paranormal Activity 2"; year = 2010 }
            @{ idx = 2; query = "Paranormal Activity 3"; year = 2011 }
            @{ idx = 3; query = "Paranormal Activity 4"; year = 2012 }
            @{ idx = 4; query = "Paranormal Activity: The Marked Ones"; year = 2014 }
            @{ idx = 5; query = "Paranormal Activity: The Ghost Dimension"; year = 2015 }
            @{ idx = 6; query = "Paranormal Activity: Next of Kin"; year = 2021 }
        )
    },
    @{
        id = "scream"
        backdrop_search = "Scream"
        movies = @(
            @{ idx = 0; query = "Scream"; year = 1996 }
            @{ idx = 1; query = "Scream 2"; year = 1997 }
            @{ idx = 2; query = "Scream 3"; year = 2000 }
            @{ idx = 3; query = "Scream 4"; year = 2011 }
            @{ idx = 4; query = "Scream"; year = 2022 }
            @{ idx = 5; query = "Scream VI"; year = 2023 }
        )
    },
    @{
        id = "evil-dead"
        backdrop_search = "Evil Dead Rise"
        movies = @(
            @{ idx = 0; query = "The Evil Dead"; year = 1981 }
            @{ idx = 1; query = "Evil Dead II"; year = 1987 }
            @{ idx = 2; query = "Army of Darkness"; year = 1992 }
            @{ idx = 3; query = "Evil Dead"; year = 2013 }
            @{ idx = 4; query = "Evil Dead Rise"; year = 2023 }
        )
    },
    @{
        id = "halloween"
        backdrop_search = "Halloween"
        movies = @(
            @{ idx = 0; query = "Halloween"; year = 1978 }
            @{ idx = 1; query = "Halloween"; year = 2018 }
            @{ idx = 2; query = "Halloween Kills"; year = 2021 }
            @{ idx = 3; query = "Halloween Ends"; year = 2022 }
        )
    },
    @{
        id = "freddy"
        backdrop_search = "A Nightmare on Elm Street"
        movies = @(
            @{ idx = 0; query = "A Nightmare on Elm Street"; year = 1984 }
            @{ idx = 1; query = "A Nightmare on Elm Street Part 2: Freddy's Revenge"; year = 1985 }
            @{ idx = 2; query = "A Nightmare on Elm Street 3: Dream Warriors"; year = 1987 }
            @{ idx = 3; query = "A Nightmare on Elm Street 4: The Dream Master"; year = 1988 }
            @{ idx = 4; query = "A Nightmare on Elm Street 5: The Dream Child"; year = 1989 }
            @{ idx = 5; query = "Freddy's Dead: The Final Nightmare"; year = 1991 }
            @{ idx = 6; query = "New Nightmare"; year = 1994 }
            @{ idx = 7; query = "Freddy vs. Jason"; year = 2003 }
        )
    },
    @{
        id = "jason"
        backdrop_search = "Friday the 13th"
        movies = @(
            @{ idx = 0; query = "Friday the 13th"; year = 1980 }
            @{ idx = 1; query = "Friday the 13th Part 2"; year = 1981 }
            @{ idx = 2; query = "Friday the 13th Part III"; year = 1982 }
            @{ idx = 3; query = "Friday the 13th: The Final Chapter"; year = 1984 }
            @{ idx = 4; query = "Friday the 13th: A New Beginning"; year = 1985 }
            @{ idx = 5; query = "Friday the 13th Part VI: Jason Lives"; year = 1986 }
            @{ idx = 6; query = "Friday the 13th Part VII: The New Blood"; year = 1988 }
            @{ idx = 7; query = "Friday the 13th Part VIII: Jason Takes Manhattan"; year = 1989 }
            @{ idx = 8; query = "Jason Goes to Hell: The Final Friday"; year = 1993 }
            @{ idx = 9; query = "Jason X"; year = 2001 }
        )
    },
    @{
        id = "quiet-place"
        backdrop_search = "A Quiet Place"
        movies = @(
            @{ idx = 0; query = "A Quiet Place"; year = 2018 }
            @{ idx = 1; query = "A Quiet Place Part II"; year = 2020 }
            @{ idx = 2; query = "A Quiet Place: Day One"; year = 2024 }
        )
    }
)

Write-Output "Starting TMDB ID Audit..."

$results = @{}

foreach ($f in $franchises) {
    # Find backdrop image
    $qBackdrop = [System.Web.HttpUtility]::UrlEncode($f.backdrop_search)
    $urlBackdrop = "https://api.themoviedb.org/3/search/movie?api_key=$apiKey&query=$qBackdrop&language=en-US"
    $resBackdrop = Invoke-RestMethod -Uri $urlBackdrop
    $backdropPath = ""
    if ($resBackdrop.results -and $resBackdrop.results.Count -gt 0) {
        $backdropPath = $resBackdrop.results[0].backdrop_path
    }
    
    Write-Output "Franchise: $($f.id) -> Backdrop: $backdropPath"
    
    $movieIds = @()
    foreach ($m in $f.movies) {
        $qMovie = [System.Web.HttpUtility]::UrlEncode($m.query)
        $urlMovie = "https://api.themoviedb.org/3/search/movie?api_key=$apiKey&query=$qMovie&primary_release_year=$($m.year)&language=en-US"
        $resMovie = Invoke-RestMethod -Uri $urlMovie
        
        $tmdbId = 0
        if ($resMovie.results -and $resMovie.results.Count -gt 0) {
            $tmdbId = $resMovie.results[0].id
        } else {
            $urlFallback = "https://api.themoviedb.org/3/search/movie?api_key=$apiKey&query=$qMovie&language=en-US"
            $resFallback = Invoke-RestMethod -Uri $urlFallback
            if ($resFallback.results -and $resFallback.results.Count -gt 0) {
                $tmdbId = $resFallback.results[0].id
            }
        }
        
        Write-Output "  Resolved: $($m.query) ($($m.year)) -> $tmdbId"
        $movieIds += [PSCustomObject]@{
            idx = $m.idx
            id = $tmdbId
            title = $m.query
        }
        Start-Sleep -Milliseconds 150
    }
    
    $results[$f.id] = @{
        backdrop = $backdropPath
        movies = $movieIds
    }
}

# Save results as a clean JSON file
$results | ConvertTo-Json -Depth 5 | Out-File -FilePath "f:/Horror movie PJ/resolved_ids.json" -Encoding utf8
Write-Output "Finished! Saved to resolved_ids.json"
