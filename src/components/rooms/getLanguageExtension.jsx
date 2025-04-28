
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { go } from '@codemirror/lang-go';
import { rust } from '@codemirror/lang-rust';
import { sql } from '@codemirror/lang-sql';

function getLanguageExtension(languageName){

    const lang = languageName?.toLowerCase() || 'javascript';

    switch(lang){
        case 'javascript': 
        case 'ruby':
        case 'kotlin':
        case 'typescript':  return javascript({ jsx: true, typescript: true });
        case 'python': return python();
        case 'swift':
        case 'java': return java();
        case 'c':
        case 'c++':
        case 'cpp': return cpp();
        case 'go': return go();
        case 'rust': return rust();
        case 'sql': return sql();
    }
}

export default getLanguageExtension;