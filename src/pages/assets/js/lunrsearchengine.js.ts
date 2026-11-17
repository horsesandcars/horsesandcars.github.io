import { SITE } from '../../../config';
import { getPosts, postUrl, stripMarkdown } from '../../../lib/posts';

// Builds the client-side lunr search index (replaces the Liquid-generated lunrsearchengine.js).

interface MdPage {
  frontmatter: { title: string };
  rawContent: () => string;
}

const pages = import.meta.glob<MdPage>('../../*.md', { eager: true });

export async function GET() {
  const documents: { id: number; url: string; title: string; body: string }[] = [];

  for (const [file, mod] of Object.entries(pages)) {
    const slug = file.replace(/^.*\//, '').replace(/\.md$/, '');
    documents.push({
      id: documents.length,
      url: `${SITE.url}/${slug}`,
      title: mod.frontmatter.title,
      body: stripMarkdown(mod.rawContent()),
    });
  }

  for (const post of await getPosts()) {
    const d = post.data.date;
    const date = `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}`;
    documents.push({
      id: documents.length,
      url: `${SITE.url}${postUrl(post)}`,
      title: post.data.title,
      body: `${date} - ${stripMarkdown(post.body ?? '')}`,
    });
  }

  const js = `var documents = ${JSON.stringify(documents)};
${ENGINE}`;
  return new Response(js, { headers: { 'Content-Type': 'application/javascript; charset=utf-8' } });
}

const ENGINE = String.raw`
var idx = lunr(function () {
    this.ref('id');
    this.field('title');
    this.field('body');
    documents.forEach(function (doc) { this.add(doc); }, this);
});

function lunr_search(term) {
    $('#lunrsearchresults').show(400);
    $('body').addClass('modal-open');

    document.getElementById('lunrsearchresults').innerHTML = '<div id="resultsmodal" class="modal fade show d-block" tabindex="-1" role="dialog" aria-labelledby="resultsmodal"> <div class="modal-dialog shadow-lg" role="document"> <div class="modal-content"> <div class="modal-header" id="modtit"> <button type="button" class="close" id="btnx" data-dismiss="modal" aria-label="Close"> &times; </button> </div> <div class="modal-body"> <ul class="mb-0"> </ul>    </div> <div class="modal-footer"><button id="btnx" type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Close</button></div></div> </div></div>';
    if (term) {
        document.getElementById('modtit').innerHTML = "<h5 class='modal-title'>Search results for '" + term + "'</h5>" + document.getElementById('modtit').innerHTML;
        var results = idx.search(term);
        var list = document.querySelectorAll('#lunrsearchresults ul')[0];
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var doc = documents[results[i]['ref']];
                var body = doc.body.substring(0, 160) + '...';
                list.innerHTML = list.innerHTML + "<li class='lunrsearchresult'><a href='" + doc.url + "'><span class='title'>" + doc.title + "</span><br /><small><span class='body'>" + body + "</span><br /><span class='url'>" + doc.url + "</span></small></a></li>";
            }
        } else {
            list.innerHTML = "<li class='lunrsearchresult'>Sorry, no results found. Close & try a different search!</li>";
        }
    }
    return false;
}

$(function () {
    $('#lunrsearchresults').on('click', '#btnx', function () {
        $('#lunrsearchresults').hide(5);
        $('body').removeClass('modal-open');
    });
});
`;
