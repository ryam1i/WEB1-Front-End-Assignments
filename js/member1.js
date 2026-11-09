$(document).ready(function () {
  const $search = $('#catalog-search');
  const $suggestions = $('#search-suggestions');
  const $grid = $('#product-grid');
  const $count = $('#product-count');
  const $priceFilter = $('#price-filter');
  let activeSuggestion = -1;

  if (!$search.length || !$grid.length) return;

  function getCards() {
    return $grid.find('article.card');
  }

  function getNamesAndCategories() {
    const items = [];

    getCards().each(function () {
      const $card = $(this);
      const names = [
        $card.find('.tier-title').first().text().trim(),
        $card.find('.tier-badge').first().text().trim()
      ];

      names.forEach(function (name) {
        if (name && !items.some(function (item) {
          return item.toLowerCase() === name.toLowerCase();
        })) {
          items.push(name);
        }
      });
    });

    return items;
  }

  function clearHighlights(card) {
    $(card).find('mark.search-highlight').each(function () {
      $(this).replaceWith(document.createTextNode(this.textContent));
    });
  }

  function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightMatches(card, query) {
  const title = card.querySelector('.tier-title');
  if (!title) return;

  const text = title.textContent;
  title.textContent = text;

  if (!query) return;

  const matcher = new RegExp(escapeRegExp(query), 'gi');
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  let match;

  while ((match = matcher.exec(text)) !== null) {
    fragment.appendChild(
      document.createTextNode(text.slice(lastIndex, match.index))
    );

    const mark = document.createElement('mark');
    mark.className = 'search-highlight';
    mark.textContent = match[0];
    fragment.appendChild(mark);

    lastIndex = match.index + match[0].length;
  }

  fragment.appendChild(
    document.createTextNode(text.slice(lastIndex))
  );

  title.replaceChildren(fragment);
}

  function showSuggestions(query) {
    $suggestions.empty();
    activeSuggestion = -1;

    if (!query) {
      $suggestions.prop('hidden', true);
      $search.attr('aria-expanded', 'false');
      return;
    }

    const matches = getNamesAndCategories()
      .filter(function (name) {
        return name.toLowerCase().includes(query.toLowerCase());
      })
      .slice(0, 6);

    if (!matches.length) {
      $suggestions.prop('hidden', true);
      $search.attr('aria-expanded', 'false');
      return;
    }

    matches.forEach(function (name, index) {
      $('<li>', {
        id: 'search-suggestion-' + index,
        role: 'option',
        'aria-selected': 'false',
        text: name
      }).appendTo($suggestions);
    });

    $suggestions.prop('hidden', false);
    $search.attr('aria-expanded', 'true');
  }

  function applySearch() {
    const originalQuery = $search.val().trim();
    const query = originalQuery.toLowerCase();
    let visibleCount = 0;

    getCards().each(function () {
      const card = this;
      const $card = $(card);

      clearHighlights(card);

      const matches = !query ||
        card.textContent.toLowerCase().includes(query);

      $card.toggleClass('search-hidden', !matches);

      if (matches) {
        highlightMatches(card, originalQuery);

        if (!card.hidden) {
          visibleCount += 1;
        }
      }
    });

    const totalCount = getCards().length;

    if (query) {
      $count.text(
        visibleCount
          ? 'Showing ' + visibleCount + ' of ' + totalCount + ' matching builds.'
          : 'No builds match your search.'
      );
    } else {
      $count.text('Builds shown: ' + visibleCount);
    }

    showSuggestions(originalQuery);
  }

  function selectSuggestion(index) {
    const $options = $suggestions.children('[role="option"]');

    if (index < 0 || index >= $options.length) return;

    $search.val($options.eq(index).text());
    $suggestions.prop('hidden', true).empty();
    $search.attr({
      'aria-expanded': 'false',
      'aria-activedescendant': ''
    });

    applySearch();
    $search.trigger('focus');
  }

  $search.on('keyup input', applySearch);

  $priceFilter.on('change', applySearch);

  $search.on('keydown', function (event) {
    const $options = $suggestions.children('[role="option"]');

    if ($suggestions.prop('hidden') || !$options.length) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      const direction = event.key === 'ArrowDown' ? 1 : -1;
      activeSuggestion =
        (activeSuggestion + direction + $options.length) % $options.length;

      $options
        .removeClass('is-active')
        .attr('aria-selected', 'false');

      const $active = $options.eq(activeSuggestion);
      $active.addClass('is-active').attr('aria-selected', 'true');

      $search.attr('aria-activedescendant', $active.attr('id'));
    }

    if (event.key === 'Enter' && activeSuggestion >= 0) {
      event.preventDefault();
      selectSuggestion(activeSuggestion);
    }

    if (event.key === 'Escape') {
      $suggestions.prop('hidden', true);
      $search.attr({
        'aria-expanded': 'false',
        'aria-activedescendant': ''
      });
    }
  });

  $suggestions.on('mousedown', '[role="option"]', function (event) {
    event.preventDefault();
    selectSuggestion($(this).index());
  });

  $(document).on('click', function (event) {
    if (!$(event.target).closest('.catalog-search').length) {
      $suggestions.prop('hidden', true);
      $search.attr('aria-expanded', 'false');
    }
  });

  const observer = new MutationObserver(function (mutations) {
    const newCardsWereAdded = mutations.some(function (mutation) {
      return mutation.addedNodes.length > 0;
    });

    if (newCardsWereAdded) {
      applySearch();
    }
  });

  observer.observe($grid[0], { childList: true });

  applySearch();
});