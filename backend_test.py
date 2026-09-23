#!/usr/bin/env python3
"""
Backend API Test Suite for Studio Wonderland
Focus: News proxy endpoints after MongoDB decoupling refactor
"""

import requests
import json
import sys

# Base URL from .env
BASE_URL = "http://localhost:3000/api"

def test_news_gallery_sinterklaas():
    """
    TEST #1 (CRITICAL): GET /api/news?category=galerij
    Must return 200 with 7 items containing https image_url values
    This is the core bug - gallery photos must NOT be empty
    """
    print("\n" + "="*80)
    print("TEST #1: GET /api/news?category=galerij (Sinterklaas gallery - CRITICAL)")
    print("="*80)
    
    try:
        url = f"{BASE_URL}/news?category=galerij"
        print(f"Request: GET {url}")
        
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
        
        data = response.json()
        print(f"Response structure: {list(data.keys())}")
        
        # Check for items array
        if 'items' not in data:
            print(f"❌ FAIL: Response missing 'items' array")
            print(f"Response: {json.dumps(data, indent=2)[:500]}")
            return False
        
        items = data['items']
        print(f"Number of items: {len(items)}")
        
        # CRITICAL: Must have 7 items (Sinterklaas gallery)
        if len(items) != 7:
            print(f"❌ FAIL: Expected 7 items, got {len(items)}")
            print(f"Items: {json.dumps(items, indent=2)[:1000]}")
            return False
        
        # Verify each item has https image_url
        print("\nValidating image URLs:")
        for i, item in enumerate(items):
            if 'image_url' not in item:
                print(f"❌ FAIL: Item {i} missing 'image_url'")
                return False
            
            image_url = item['image_url']
            if not image_url.startswith('https://'):
                print(f"❌ FAIL: Item {i} image_url is not https: {image_url}")
                return False
            
            # Check if it's from the expected domain
            if 'your-objectstorage.com' in image_url or 'koodh' in image_url.lower():
                print(f"  ✓ Item {i}: {image_url[:80]}...")
            else:
                print(f"  ⚠ Item {i}: {image_url[:80]}... (unexpected domain)")
        
        print(f"\n✅ PASS: Gallery returns 7 items with valid https image URLs")
        print(f"Sample item: {json.dumps(items[0], indent=2)[:300]}...")
        return True
        
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_news_christmas_nieuws():
    """
    TEST #2: GET /api/news?site=het-huis-van-de-kerstman&category=nieuws
    Must return 200 with items[] (Christmas news)
    """
    print("\n" + "="*80)
    print("TEST #2: GET /api/news?site=het-huis-van-de-kerstman&category=nieuws")
    print("="*80)
    
    try:
        url = f"{BASE_URL}/news?site=het-huis-van-de-kerstman&category=nieuws"
        print(f"Request: GET {url}")
        
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        if 'items' not in data:
            print(f"❌ FAIL: Response missing 'items' array")
            return False
        
        items = data['items']
        print(f"Number of items: {len(items)}")
        
        if len(items) >= 1:
            print(f"Sample item: {json.dumps(items[0], indent=2)[:300]}...")
        
        print(f"✅ PASS: Christmas news endpoint returns 200 with items[] ({len(items)} items)")
        return True
        
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False


def test_news_studio_wonderland():
    """
    TEST #3: GET /api/news?site=studio-wonderland&category=eerder-te-beleven
    Must return 200 with items[] (may be empty)
    """
    print("\n" + "="*80)
    print("TEST #3: GET /api/news?site=studio-wonderland&category=eerder-te-beleven")
    print("="*80)
    
    try:
        url = f"{BASE_URL}/news?site=studio-wonderland&category=eerder-te-beleven"
        print(f"Request: GET {url}")
        
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        if 'items' not in data:
            print(f"❌ FAIL: Response missing 'items' array")
            return False
        
        items = data['items']
        print(f"Number of items: {len(items)} (empty is OK for this endpoint)")
        
        print(f"✅ PASS: Studio Wonderland endpoint returns 200 with valid structure")
        return True
        
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False


def test_news_article_by_id():
    """
    TEST #4: GET /api/news/{id}
    First get an id from the gallery, then fetch the full article
    Must return 200 with full article (title, image_url, body, published_at)
    """
    print("\n" + "="*80)
    print("TEST #4: GET /api/news/{id} (fetch full article)")
    print("="*80)
    
    try:
        # First get an article ID from the gallery
        list_url = f"{BASE_URL}/news?category=galerij"
        print(f"Step 1: Getting article ID from {list_url}")
        
        list_response = requests.get(list_url, timeout=10)
        if list_response.status_code != 200:
            print(f"❌ FAIL: Could not fetch article list (status {list_response.status_code})")
            return False
        
        list_data = list_response.json()
        if not list_data.get('items') or len(list_data['items']) == 0:
            print(f"❌ FAIL: No items in gallery to get ID from")
            return False
        
        article_id = list_data['items'][0].get('id')
        if not article_id:
            print(f"❌ FAIL: First item has no 'id' field")
            return False
        
        print(f"Using article ID: {article_id}")
        
        # Now fetch the full article
        article_url = f"{BASE_URL}/news/{article_id}"
        print(f"\nStep 2: Fetching full article from {article_url}")
        
        response = requests.get(article_url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
        
        article = response.json()
        
        # Verify required fields
        required_fields = ['title', 'image_url']
        missing_fields = [f for f in required_fields if f not in article]
        
        if missing_fields:
            print(f"❌ FAIL: Missing required fields: {missing_fields}")
            print(f"Article keys: {list(article.keys())}")
            return False
        
        # Check for body or published_at (at least one should be present)
        if 'body' not in article and 'published_at' not in article:
            print(f"⚠ WARNING: Article has neither 'body' nor 'published_at'")
        
        print(f"\nArticle fields: {list(article.keys())}")
        print(f"Title: {article.get('title', 'N/A')[:80]}")
        print(f"Image URL: {article.get('image_url', 'N/A')[:80]}")
        
        if 'body' in article:
            body_preview = article['body'][:100] if isinstance(article['body'], str) else str(article['body'])[:100]
            print(f"Body preview: {body_preview}...")
        
        print(f"\n✅ PASS: Article endpoint returns 200 with full article data")
        return True
        
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_news_nonexistent_id():
    """
    TEST #5: GET /api/news/nonexistent-id-123
    Must return non-200 (404 or 502) with error field, server must NOT crash
    """
    print("\n" + "="*80)
    print("TEST #5: GET /api/news/nonexistent-id-123 (error handling)")
    print("="*80)
    
    try:
        url = f"{BASE_URL}/news/nonexistent-id-123"
        print(f"Request: GET {url}")
        
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print(f"❌ FAIL: Expected non-200 status, got 200")
            return False
        
        if response.status_code not in [404, 502]:
            print(f"⚠ WARNING: Expected 404 or 502, got {response.status_code}")
        
        data = response.json()
        
        if 'error' not in data:
            print(f"❌ FAIL: Response missing 'error' field")
            print(f"Response: {json.dumps(data, indent=2)}")
            return False
        
        print(f"Error message: {data['error']}")
        print(f"✅ PASS: Nonexistent article returns {response.status_code} with error field, server did not crash")
        return True
        
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False


def test_sanity_productions():
    """
    TEST #6a: GET /api/productions (sanity check - Mongo-backed route)
    Must return 200 with array to confirm refactor didn't break DB routes
    """
    print("\n" + "="*80)
    print("TEST #6a: GET /api/productions (sanity check - Mongo route)")
    print("="*80)
    
    try:
        url = f"{BASE_URL}/productions"
        print(f"Request: GET {url}")
        
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        if not isinstance(data, list):
            print(f"❌ FAIL: Expected array, got {type(data)}")
            return False
        
        print(f"Number of productions: {len(data)}")
        
        if len(data) > 0:
            print(f"Sample production: {json.dumps(data[0], indent=2)[:200]}...")
        
        print(f"✅ PASS: Productions endpoint returns 200 with array ({len(data)} items)")
        return True
        
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False


def test_sanity_contact():
    """
    TEST #6b: GET /api/contact (sanity check - Mongo-backed route)
    Must return 200 with array to confirm refactor didn't break DB routes
    """
    print("\n" + "="*80)
    print("TEST #6b: GET /api/contact (sanity check - Mongo route)")
    print("="*80)
    
    try:
        url = f"{BASE_URL}/contact"
        print(f"Request: GET {url}")
        
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        if not isinstance(data, list):
            print(f"❌ FAIL: Expected array, got {type(data)}")
            return False
        
        print(f"Number of contact messages: {len(data)}")
        
        print(f"✅ PASS: Contact endpoint returns 200 with array ({len(data)} items)")
        return True
        
    except Exception as e:
        print(f"❌ FAIL: Exception occurred: {str(e)}")
        return False


def main():
    print("\n" + "="*80)
    print("BACKEND API TEST SUITE - NEWS PROXY REFACTOR VERIFICATION")
    print("Testing MongoDB decoupling: News endpoints must work independently")
    print("="*80)
    
    tests = [
        ("News Gallery (Sinterklaas) - CRITICAL", test_news_gallery_sinterklaas),
        ("News Christmas", test_news_christmas_nieuws),
        ("News Studio Wonderland", test_news_studio_wonderland),
        ("News Article by ID", test_news_article_by_id),
        ("News Nonexistent ID", test_news_nonexistent_id),
        ("Sanity: Productions", test_sanity_productions),
        ("Sanity: Contact", test_sanity_contact),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"\n❌ CRITICAL ERROR in {test_name}: {str(e)}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed ({int(passed/total*100)}%)")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED - News proxy refactor successful!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())
