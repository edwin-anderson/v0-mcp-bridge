export interface ParsedComponent {
  code: string;
  metadata: {
    name: string;
    imports: string[];
    usage: string;
    integrationSteps: string[];
    customizationNotes: string[];
  };
}

export interface ParsedAnalysis {
  componentsNeeded: Array<{
    name: string;
    type: 'ui_component' | 'page_component' | 'layout_component';
    visualPurpose: string;
    shadcnDependencies: string[];
    priority: 'high' | 'medium' | 'low';
  }>;
  buildOrder: string[];
  visualRelationships: Array<{
    component: string;
    containedWithin?: string;
    visuallyRelatedTo: string[];
    sharedPatterns?: string[];
  }>;
  shadcnIntegration: {
    componentMappings: Array<{
      component: string;
      shadcnComponents: string[];
      combinations: string[];
    }>;
    consistencyPatterns: string[];
  };
}

export function extractComponentCode(response: string): string {
  // Try to extract code from tsx/jsx blocks first
  const tsxMatch = response.match(/```(?:tsx?|jsx?)\n([\s\S]*?)\n```/);
  if (tsxMatch) return tsxMatch[1].trim();
  
  // Fallback to any code block
  const codeMatch = response.match(/```\n([\s\S]*?)\n```/);
  if (codeMatch) return codeMatch[1].trim();
  
  // If no code blocks, assume the whole response is code
  return response.trim();
}

export function parseComponentResponse(response: string): ParsedComponent {
  const code = extractComponentCode(response);
  
  // Extract component name from the code
  const componentNameMatch = code.match(/(?:export\s+default\s+function|function|const)\s+(\w+)/);
  const componentName = componentNameMatch?.[1] || 'GeneratedComponent';
  
  // Extract imports from the code
  const importMatches = code.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g) || [];
  const imports = importMatches
    .map(match => match.match(/from\s+['"]([^'"]+)['"]/)?.[1])
    .filter((imp): imp is string => Boolean(imp));
  
  // Extract metadata sections after code block
  const sections = response.split(/\n(?=[A-Z\s]+:)/);
  
  let usage = '';
  let integrationSteps: string[] = [];
  let customizationNotes: string[] = [];
  
  sections.forEach(section => {
    if (section.includes('USAGE EXAMPLE:')) {
      usage = extractCodeBlock(section) || extractTextContent(section, 'USAGE EXAMPLE:');
    } else if (section.includes('INTEGRATION GUIDELINES:') || section.includes('INTEGRATION STEPS:')) {
      integrationSteps = extractListItems(section);
    } else if (section.includes('CUSTOMIZATION NOTES:')) {
      customizationNotes = extractListItems(section);
    }
  });
  
  return {
    code,
    metadata: {
      name: componentName,
      imports,
      usage,
      integrationSteps,
      customizationNotes
    }
  };
}

export function parseAnalysisResponse(response: string): ParsedAnalysis {
  const componentsNeeded: ParsedAnalysis['componentsNeeded'] = [];
  const buildOrder: string[] = [];
  const visualRelationships: ParsedAnalysis['visualRelationships'] = [];
  const shadcnIntegration: ParsedAnalysis['shadcnIntegration'] = {
    componentMappings: [],
    consistencyPatterns: []
  };
  
  // Split response into sections
  const sections = response.split(/\n(?=\d+\.|[A-Z\s]+:)/);
  
  sections.forEach(section => {
    if (section.includes('VISUAL COMPONENT HIERARCHY:') || section.includes('COMPONENTS NEEDED:')) {
      const componentBlocks = section.split(/\n(?=-\s*Name:)/);
      componentBlocks.slice(1).forEach(block => {
        const component = parseUIComponentBlock(block);
        if (component) componentsNeeded.push(component);
      });
    } else if (section.includes('COMPONENT BUILD ORDER:') || section.includes('BUILD ORDER:')) {
      buildOrder.push(...extractListItems(section));
    } else if (section.includes('VISUAL RELATIONSHIPS:')) {
      const relationshipBlocks = section.split(/\n(?=-\s*Which|Component:)/);
      relationshipBlocks.slice(1).forEach(block => {
        const relationship = parseVisualRelationshipBlock(block);
        if (relationship) visualRelationships.push(relationship);
      });
    } else if (section.includes('SHADCN/UI INTEGRATION:')) {
      const integrationData = parseShadcnIntegrationSection(section);
      shadcnIntegration.componentMappings = integrationData.componentMappings;
      shadcnIntegration.consistencyPatterns = integrationData.consistencyPatterns;
    }
  });
  
  return {
    componentsNeeded,
    buildOrder,
    visualRelationships,
    shadcnIntegration
  };
}

function parseUIComponentBlock(block: string): ParsedAnalysis['componentsNeeded'][0] | null {
  const lines = block.split('\n').map(line => line.trim());
  const component: Partial<ParsedAnalysis['componentsNeeded'][0]> = {};
  
  lines.forEach(line => {
    if (line.startsWith('- Name:') || line.startsWith('Name:')) {
      component.name = line.replace(/^-?\s*Name:\s*/i, '').trim();
    } else if (line.startsWith('- Type:') || line.startsWith('Type:')) {
      const type = line.replace(/^-?\s*Type:\s*/i, '').trim().toLowerCase();
      if (type === 'ui_component' || type === 'page_component' || type === 'layout_component') {
        component.type = type;
      }
    } else if (line.startsWith('- Visual Purpose:') || line.startsWith('Visual Purpose:')) {
      component.visualPurpose = line.replace(/^-?\s*Visual Purpose:\s*/i, '').trim();
    } else if (line.startsWith('- Shadcn Dependencies:') || line.startsWith('Shadcn Dependencies:')) {
      const deps = line.replace(/^-?\s*Shadcn Dependencies:\s*/i, '').trim();
      component.shadcnDependencies = deps.split(/,\s*/).filter(Boolean);
    } else if (line.startsWith('- Priority:') || line.startsWith('Priority:')) {
      const priority = line.replace(/^-?\s*Priority:\s*/i, '').trim().toLowerCase();
      if (priority === 'high' || priority === 'medium' || priority === 'low') {
        component.priority = priority;
      }
    }
  });
  
  // Validate required fields
  if (component.name && component.type && component.visualPurpose) {
    return {
      name: component.name,
      type: component.type,
      visualPurpose: component.visualPurpose,
      shadcnDependencies: component.shadcnDependencies || [],
      priority: component.priority || 'medium'
    };
  }
  
  return null;
}

function parseVisualRelationshipBlock(block: string): ParsedAnalysis['visualRelationships'][0] | null {
  const lines = block.split('\n').map(line => line.trim());
  const relationship: Partial<ParsedAnalysis['visualRelationships'][0]> = {};
  
  lines.forEach(line => {
    if (line.includes('Component:') || line.startsWith('- ') && !line.includes(':')) {
      const componentMatch = line.match(/Component:\s*(.+)|^-\s*(.+)/);
      if (componentMatch) {
        relationship.component = (componentMatch[1] || componentMatch[2]).trim();
      }
    } else if (line.includes('contained within') || line.includes('Contained within')) {
      const containedMatch = line.match(/contained within:?\s*(.+)/i);
      if (containedMatch) {
        relationship.containedWithin = containedMatch[1].trim();
      }
    } else if (line.includes('visually related to') || line.includes('relates to')) {
      const relatedMatch = line.match(/(?:visually related to|relates to):?\s*(.+)/i);
      if (relatedMatch) {
        relationship.visuallyRelatedTo = relatedMatch[1].split(/,\s*/).filter(Boolean);
      }
    } else if (line.includes('shared patterns') || line.includes('Shared patterns')) {
      relationship.sharedPatterns = extractInlineList(line);
    }
  });
  
  if (relationship.component && relationship.visuallyRelatedTo && relationship.visuallyRelatedTo.length > 0) {
    return {
      component: relationship.component,
      containedWithin: relationship.containedWithin,
      visuallyRelatedTo: relationship.visuallyRelatedTo,
      sharedPatterns: relationship.sharedPatterns
    };
  }
  
  return null;
}

function parseShadcnIntegrationSection(section: string): ParsedAnalysis['shadcnIntegration'] {
  const componentMappings: ParsedAnalysis['shadcnIntegration']['componentMappings'] = [];
  const consistencyPatterns: string[] = [];
  
  const lines = section.split('\n');
  let currentMapping: Partial<ParsedAnalysis['shadcnIntegration']['componentMappings'][0]> = {};
  
  lines.forEach(line => {
    const trimmed = line.trim();
    
    if (trimmed.includes('Component:') || (trimmed.startsWith('- ') && trimmed.includes(':'))) {
      // Save previous mapping if complete
      if (currentMapping.component && currentMapping.shadcnComponents) {
        componentMappings.push({
          component: currentMapping.component,
          shadcnComponents: currentMapping.shadcnComponents,
          combinations: currentMapping.combinations || []
        });
      }
      
      // Start new mapping
      const componentMatch = trimmed.match(/(?:Component:|^-\s*)(.+?)(?:\s*-|$)/);
      if (componentMatch) {
        currentMapping = { component: componentMatch[1].trim() };
      }
    } else if (trimmed.includes('shadcn components:') || trimmed.includes('Uses:')) {
      const componentsMatch = trimmed.match(/(?:shadcn components:|Uses:)\s*(.+)/i);
      if (componentsMatch) {
        currentMapping.shadcnComponents = componentsMatch[1].split(/,\s*/).filter(Boolean);
      }
    } else if (trimmed.includes('combinations:') || trimmed.includes('Combines:')) {
      const combinationsMatch = trimmed.match(/(?:combinations:|Combines:)\s*(.+)/i);
      if (combinationsMatch) {
        currentMapping.combinations = combinationsMatch[1].split(/,\s*/).filter(Boolean);
      }
    } else if (trimmed.includes('consistency') || trimmed.includes('pattern')) {
      if (trimmed.startsWith('-') || trimmed.match(/^\d+\./)) {
        consistencyPatterns.push(trimmed.replace(/^[-*]\s+|^\d+\.\s+/, '').trim());
      }
    }
  });
  
  // Save final mapping
  if (currentMapping.component && currentMapping.shadcnComponents) {
    componentMappings.push({
      component: currentMapping.component,
      shadcnComponents: currentMapping.shadcnComponents,
      combinations: currentMapping.combinations || []
    });
  }
  
  return {
    componentMappings,
    consistencyPatterns
  };
}

function extractCodeBlock(section: string): string | null {
  const codeMatch = section.match(/```(?:\w+)?\n([\s\S]*?)\n```/);
  return codeMatch ? codeMatch[1].trim() : null;
}

function extractTextContent(section: string, marker: string): string {
  const lines = section.split('\n');
  const markerIndex = lines.findIndex(line => line.includes(marker));
  if (markerIndex === -1) return '';
  
  return lines
    .slice(markerIndex + 1)
    .join('\n')
    .trim();
}

function extractListItems(section: string): string[] {
  const lines = section.split('\n');
  const items: string[] = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.match(/^[-*]\s+/) || trimmed.match(/^\d+\.\s+/)) {
      items.push(trimmed.replace(/^[-*]\s+|^\d+\.\s+/, '').trim());
    }
  });
  
  return items;
}

function extractSubListItems(lines: string[], startIndex: number): string[] {
  const items: string[] = [];
  
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^[-*]\s+/) || line.match(/^\d+\.\s+/)) {
      items.push(line.replace(/^[-*]\s+|^\d+\.\s+/, '').trim());
    } else if (line.length > 0 && !line.includes(':')) {
      break;
    }
  }
  
  return items;
}

function extractInlineList(line: string): string[] {
  const content = line.replace(/.*:\s*/, '');
  return content.split(/,\s*/).filter(Boolean);
}