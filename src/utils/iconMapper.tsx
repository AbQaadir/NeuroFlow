import React from 'react';
import Fuse from 'fuse.js';
import {
    SiAmazon, SiKubernetes, SiDocker,
    SiRedis, SiPostgresql, SiMongodb, SiMysql, SiNginx, SiApache,
    SiReact, SiNodedotjs, SiPython, SiGo, SiRust, SiTypescript,
    SiRabbitmq, SiApachekafka, SiElasticsearch, SiGraphql, SiAuth0,
    SiFirebase, SiSupabase, SiPrisma, SiTailwindcss, SiNextdotjs,
    SiVite, SiNestjs, SiExpress, SiSpringboot, SiFlutter, SiKotlin,
    SiSwift, SiAndroid, SiApple, SiLinux, SiUbuntu,
    SiGithub, SiGitlab, SiJenkins, SiTerraform, SiAnsible, SiPrometheus,
    SiGrafana, SiDatadog, SiNewrelic, SiSentry, SiSlack, SiDiscord,
    SiStripe, SiPaypal, SiTwilio, SiOpenai, SiGoogle
} from 'react-icons/si';
import {
    FaServer, FaDatabase, FaCloud, FaNetworkWired, FaLaptopCode,
    FaMobileAlt, FaGlobe, FaLock, FaKey, FaShieldAlt, FaUserCog,
    FaCogs, FaMicrochip, FaMemory, FaHdd, FaBroadcastTower
} from 'react-icons/fa';
import { MdRouter, MdStorage, MdQueue, MdApi, MdWeb, MdSecurity, MdEmail } from 'react-icons/md';
import { VscAzure } from "react-icons/vsc";
import * as SiIcons from 'react-icons/si';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';

import { ICON_REGISTRY, CATEGORY_BOOST, IconMetadata } from './iconRegistry';
import { expandSynonyms } from './synonyms';
import { AWS_CLOUD_ICONS, AWS_ICON_COMPONENTS } from './cloudIcons';

// All available icons for manual selection
export const ALL_ICONS: Record<string, React.ComponentType> = {
    ...SiIcons,
    ...FaIcons,
    ...MdIcons,
    VscAzure
};

// Icon component map for rendering (includes AWS cloud icons)
const ICON_COMPONENTS: Record<string, React.ComponentType> = {
    SiAmazon, SiKubernetes, SiDocker,
    SiRedis, SiPostgresql, SiMongodb, SiMysql, SiNginx, SiApache,
    SiReact, SiNodedotjs, SiPython, SiGo, SiRust, SiTypescript,
    SiRabbitmq, SiApachekafka, SiElasticsearch, SiGraphql, SiAuth0,
    SiFirebase, SiSupabase, SiPrisma, SiTailwindcss, SiNextdotjs,
    SiVite, SiNestjs, SiExpress, SiSpringboot, SiFlutter, SiKotlin,
    SiSwift, SiAndroid, SiApple, SiLinux, SiUbuntu,
    SiGithub, SiGitlab, SiJenkins, SiTerraform, SiAnsible, SiPrometheus,
    SiGrafana, SiDatadog, SiNewrelic, SiSentry, SiSlack, SiDiscord,
    SiStripe, SiPaypal, SiTwilio, SiOpenai, SiGoogle,
    FaServer, FaDatabase, FaCloud, FaNetworkWired, FaLaptopCode,
    FaMobileAlt, FaGlobe, FaLock, FaKey, FaShieldAlt, FaUserCog,
    FaCogs, FaMicrochip, FaMemory, FaHdd, FaBroadcastTower,
    MdRouter, MdStorage, MdQueue, MdApi, MdWeb, MdSecurity, MdEmail,
    VscAzure,
    // AWS Cloud Icons
    ...AWS_ICON_COMPONENTS
};

// Combine existing registry with AWS cloud icons
const COMBINED_REGISTRY: IconMetadata[] = [
    ...ICON_REGISTRY,
    ...AWS_CLOUD_ICONS.map(icon => ({
        iconKey: icon.iconKey,
        keywords: icon.keywords,
        category: icon.category as IconMetadata['category'],
        priority: icon.priority
    }))
];

// Initialize Fuse.js with the combined icon registry
const fuse = new Fuse(COMBINED_REGISTRY, {
    keys: [
        { name: 'keywords', weight: 0.7 },
        { name: 'iconKey', weight: 0.3 }
    ],
    threshold: 0.4,          // Allow fuzzy matches (0 = exact, 1 = match anything)
    distance: 100,           // Search across entire string
    includeScore: true,
    ignoreLocation: true,    // Don't penalize matches later in string
    minMatchCharLength: 2,
    shouldSort: true
});

// Helper to normalize text for matching
const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

// Stop words to filter out
const STOP_WORDS = new Set([
    'service', 'server', 'app', 'application', 'component', 'node', 'system',
    'database', 'db', 'icon', 'logo', 'v1', 'v2', 'v3', 'the', 'a', 'an', 'and', 'or'
]);

// Helper to tokenize and filter stop words
const tokenize = (text: string): string[] => {
    return normalize(text)
        .split(/\s+/)
        .filter(t => t.length > 1 && !STOP_WORDS.has(t));
};

// Calculate match score for custom icons (token-based)
const calculateCustomIconScore = (labelTokens: string[], iconTokens: string[]): number => {
    let score = 0;

    for (const iconToken of iconTokens) {
        for (const labelToken of labelTokens) {
            if (iconToken === labelToken) {
                score += 10; // Exact match
            } else if (labelToken.includes(iconToken) || iconToken.includes(labelToken)) {
                score += 3; // Partial match
            }
        }
    }
    return score;
};

/**
 * Main icon matching function
 * Uses a multi-strategy approach:
 * 1. Manual override (user-selected icon)
 * 2. Custom icon matching (uploaded SVGs)
 * 3. Fuse.js fuzzy search with synonym expansion
 * 4. Category-boosted fallback
 */
export const getIconForNode = (
    type: string,
    label: string,
    description: string = '',
    customIcon?: string,
    customIconsMap?: Record<string, string>
) => {
    const typeStr = type.toLowerCase();

    // ========== 1. MANUAL OVERRIDE ==========
    // If user explicitly selected an icon, use it
    if (customIcon) {
        // Check if it's a custom uploaded icon
        if (customIcon.startsWith('custom_') && customIconsMap?.[customIcon]) {
            return (
                <div
                    className="[&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
                    dangerouslySetInnerHTML={{ __html: customIconsMap[customIcon] }}
                />
            );
        }
        // Check if it's a built-in icon
        if (ICON_COMPONENTS[customIcon]) {
            const Icon = ICON_COMPONENTS[customIcon];
            return <Icon />;
        }
        // Fallback to ALL_ICONS
        if (ALL_ICONS[customIcon]) {
            const Icon = ALL_ICONS[customIcon];
            return <Icon />;
        }
    }

    // Prepare search text
    const searchText = normalize(`${label} ${description}`);
    const searchTokens = tokenize(`${label} ${description}`);

    // ========== 2. SMART CUSTOM ICON MATCHING ==========
    if (customIconsMap && Object.keys(customIconsMap).length > 0) {
        let bestMatchKey: string | null = null;
        let maxScore = 0;

        // Expand search with synonyms
        const expandedTerms = expandSynonyms(searchText);
        const allTokens = [...searchTokens, ...expandedTerms.flatMap(t => tokenize(t))];
        const uniqueTokens = [...new Set(allTokens)];

        for (const [key, svgContent] of Object.entries(customIconsMap)) {
            const iconName = key.replace(/^custom_/, '');
            const iconTokens = tokenize(iconName);

            let score = calculateCustomIconScore(uniqueTokens, iconTokens);

            // Boost for exact phrase match
            if (normalize(iconName) === normalize(label)) {
                score += 15;
            }

            // Boost for partial phrase match
            if (normalize(iconName).includes(normalize(label)) || normalize(label).includes(normalize(iconName))) {
                score += 5;
            }

            if (score > maxScore && score >= 8) { // Higher threshold for custom icons
                maxScore = score;
                bestMatchKey = key;
            }
        }

        if (bestMatchKey && customIconsMap[bestMatchKey]) {
            return (
                <div
                    className="[&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
                    dangerouslySetInnerHTML={{ __html: customIconsMap[bestMatchKey] }}
                />
            );
        }
    }

    // ========== 3. FUSE.JS FUZZY SEARCH ==========
    // Expand search terms with synonyms
    const expandedSearchTerms = expandSynonyms(searchText);

    // Collect all search results
    let allResults: { item: IconMetadata; score: number; adjustedScore: number }[] = [];

    for (const term of expandedSearchTerms) {
        const results = fuse.search(term);

        for (const result of results) {
            const fuseScore = result.score ?? 1;

            // Calculate adjusted score with category boost
            let adjustedScore = fuseScore;

            // Apply category boost if node type matches icon category
            const boostedCategories = CATEGORY_BOOST[typeStr] || [];
            if (boostedCategories.includes(result.item.category)) {
                adjustedScore = fuseScore * 0.7; // Lower is better for Fuse.js
            }

            // Apply priority boost (higher priority = lower adjusted score)
            adjustedScore = adjustedScore * (1 - (result.item.priority * 0.02));

            allResults.push({
                item: result.item,
                score: fuseScore,
                adjustedScore
            });
        }
    }

    // Remove duplicates and sort by adjusted score (lower is better)
    const seenKeys = new Set<string>();
    const uniqueResults = allResults.filter(r => {
        if (seenKeys.has(r.item.iconKey)) return false;
        seenKeys.add(r.item.iconKey);
        return true;
    }).sort((a, b) => a.adjustedScore - b.adjustedScore);

    // Return best match if score is good enough
    if (uniqueResults.length > 0 && uniqueResults[0].adjustedScore < 0.5) {
        const bestMatch = uniqueResults[0].item;
        const IconComponent = ICON_COMPONENTS[bestMatch.iconKey];
        if (IconComponent) {
            return <IconComponent />;
        }
    }

    // ========== 4. FALLBACK BY NODE TYPE ==========
    switch (typeStr) {
        case 'database':
            return <FaDatabase />;
        case 'client':
            if (searchText.includes('mobile') || searchText.includes('phone') || searchText.includes('app')) {
                return <FaMobileAlt />;
            }
            return <FaLaptopCode />;
        case 'queue':
            return <MdQueue />;
        case 'external':
            return <FaGlobe />;
        case 'group':
            return <FaCloud />;
        case 'service':
            if (searchText.includes('api') || searchText.includes('gateway')) return <MdApi />;
            if (searchText.includes('auth') || searchText.includes('login')) return <FaLock />;
            return <FaServer />;
        default:
            return <FaMicrochip />;
    }
};
