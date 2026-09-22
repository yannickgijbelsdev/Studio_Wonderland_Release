#!/usr/bin/env python3
"""
Backend API Test Suite for Studio Wonderland
Tests all Productions and Contact API endpoints
"""

import requests
import json
import sys
from datetime import datetime

# Base URL from .env
BASE_URL = "https://family-adventures-9.preview.emergentagent.com/api"

def print_test(name, passed, details=""):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status}: {name}")
    if details:
        print(f"  Details: {details}")

def test_productions_get():
    """Test GET /api/productions - should auto-seed and return array"""
    print("\n" + "="*80)
    print("TEST 1: GET /api/productions (auto-seed verification)")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/productions", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_test("GET /api/productions", False, f"Expected 200, got {response.status_code}")
            return None
        
        data = response.json()
        print(f"Response type: {type(data)}")
        print(f"Number of items: {len(data)}")
        
        # Verify it's an array
        if not isinstance(data, list):
            print_test("GET /api/productions returns array", False, f"Expected list, got {type(data)}")
            return None
        
        # Verify at least 3 items (auto-seeded)
        if len(data) < 3:
            print_test("Auto-seed creates 3 productions", False, f"Expected at least 3, got {len(data)}")
            return None
        
        # Verify structure of first item
        if len(data) > 0:
            item = data[0]
            print(f"\nFirst item keys: {item.keys()}")
            
            required_fields = ['id', 'title', 'year', 'description', 'cover', 'gallery', 'videos']
            missing_fields = [f for f in required_fields if f not in item]
            
            if missing_fields:
                print_test("Production has required fields", False, f"Missing: {missing_fields}")
                return None
            
            # Verify id is UUID string
            if not isinstance(item['id'], str) or len(item['id']) < 32:
                print_test("Production id is UUID string", False, f"id: {item['id']}")
                return None
            
            # Verify year is number
            if not isinstance(item['year'], int):
                print_test("Production year is number", False, f"year type: {type(item['year'])}")
                return None
            
            # Verify gallery and videos are arrays
            if not isinstance(item['gallery'], list):
                print_test("Production gallery is array", False, f"gallery type: {type(item['gallery'])}")
                return None
            
            if not isinstance(item['videos'], list):
                print_test("Production videos is array", False, f"videos type: {type(item['videos'])}")
                return None
            
            # Verify _id is NOT present
            if '_id' in item:
                print_test("Mongo _id is stripped", False, "_id found in response")
                return None
            
            print_test("GET /api/productions structure", True, f"All fields valid, no _id present")
        
        print_test("GET /api/productions", True, f"Returns {len(data)} productions")
        return data
        
    except Exception as e:
        print_test("GET /api/productions", False, f"Exception: {str(e)}")
        return None

def test_productions_post():
    """Test POST /api/productions - create new production"""
    print("\n" + "="*80)
    print("TEST 2: POST /api/productions (create new production)")
    print("="*80)
    
    try:
        new_production = {
            "title": "Test Production 2026",
            "year": 2026,
            "description": "A magical test production for automated testing",
            "cover": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80",
            "gallery": [
                "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=80",
                "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1600&q=80"
            ],
            "videos": ["https://www.youtube.com/watch?v=test123"]
        }
        
        response = requests.post(f"{BASE_URL}/productions", json=new_production, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_test("POST /api/productions", False, f"Expected 200, got {response.status_code}")
            return None
        
        data = response.json()
        print(f"Created production: {json.dumps(data, indent=2)}")
        
        # Verify response has id
        if 'id' not in data:
            print_test("POST returns object with id", False, "No id in response")
            return None
        
        # Verify id is UUID
        if not isinstance(data['id'], str) or len(data['id']) < 32:
            print_test("POST returns UUID id", False, f"id: {data['id']}")
            return None
        
        # Verify _id is NOT present
        if '_id' in data:
            print_test("POST response strips _id", False, "_id found in response")
            return None
        
        # Verify data matches input
        if data['title'] != new_production['title']:
            print_test("POST preserves title", False, f"Expected {new_production['title']}, got {data['title']}")
            return None
        
        if data['year'] != new_production['year']:
            print_test("POST preserves year", False, f"Expected {new_production['year']}, got {data['year']}")
            return None
        
        print_test("POST /api/productions", True, f"Created production with id: {data['id']}")
        return data
        
    except Exception as e:
        print_test("POST /api/productions", False, f"Exception: {str(e)}")
        return None

def test_production_in_list(production_id):
    """Verify created production appears in GET list"""
    print("\n" + "="*80)
    print("TEST 3: Verify new production appears in GET list")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/productions", timeout=10)
        
        if response.status_code != 200:
            print_test("GET after POST", False, f"Status {response.status_code}")
            return False
        
        data = response.json()
        found = any(item['id'] == production_id for item in data)
        
        if found:
            print_test("Created production in list", True, f"Found id: {production_id}")
            return True
        else:
            print_test("Created production in list", False, f"id {production_id} not found")
            return False
            
    except Exception as e:
        print_test("GET after POST", False, f"Exception: {str(e)}")
        return False

def test_productions_put(production_id):
    """Test PUT /api/productions/{id} - update production"""
    print("\n" + "="*80)
    print(f"TEST 4: PUT /api/productions/{production_id} (update)")
    print("="*80)
    
    try:
        update_data = {
            "title": "Updated Test Production 2026",
            "description": "This production has been updated via automated testing"
        }
        
        response = requests.put(f"{BASE_URL}/productions/{production_id}", json=update_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_test("PUT /api/productions/{id}", False, f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        print(f"Updated production: {json.dumps(data, indent=2)}")
        
        # Verify _id is NOT present
        if '_id' in data:
            print_test("PUT response strips _id", False, "_id found in response")
            return False
        
        # Verify updates were applied
        if data['title'] != update_data['title']:
            print_test("PUT updates title", False, f"Expected {update_data['title']}, got {data['title']}")
            return False
        
        if data['description'] != update_data['description']:
            print_test("PUT updates description", False, f"Expected {update_data['description']}, got {data['description']}")
            return False
        
        print_test("PUT /api/productions/{id}", True, "Production updated successfully")
        return True
        
    except Exception as e:
        print_test("PUT /api/productions/{id}", False, f"Exception: {str(e)}")
        return False

def test_productions_put_not_found():
    """Test PUT with non-existent id returns 404"""
    print("\n" + "="*80)
    print("TEST 5: PUT /api/productions/non-existent-id (should return 404)")
    print("="*80)
    
    try:
        fake_id = "00000000-0000-0000-0000-000000000000"
        update_data = {"title": "Should not work"}
        
        response = requests.put(f"{BASE_URL}/productions/{fake_id}", json=update_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print_test("PUT non-existent id returns 404", True, "Correctly returned 404")
            return True
        else:
            print_test("PUT non-existent id returns 404", False, f"Expected 404, got {response.status_code}")
            return False
            
    except Exception as e:
        print_test("PUT non-existent id", False, f"Exception: {str(e)}")
        return False

def test_productions_delete(production_id):
    """Test DELETE /api/productions/{id}"""
    print("\n" + "="*80)
    print(f"TEST 6: DELETE /api/productions/{production_id}")
    print("="*80)
    
    try:
        response = requests.delete(f"{BASE_URL}/productions/{production_id}", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_test("DELETE /api/productions/{id}", False, f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        print(f"Delete response: {json.dumps(data, indent=2)}")
        
        # Verify success response
        if not data.get('success'):
            print_test("DELETE returns success:true", False, f"Response: {data}")
            return False
        
        print_test("DELETE /api/productions/{id}", True, "Production deleted successfully")
        return True
        
    except Exception as e:
        print_test("DELETE /api/productions/{id}", False, f"Exception: {str(e)}")
        return False

def test_production_not_in_list(production_id):
    """Verify deleted production no longer in list"""
    print("\n" + "="*80)
    print("TEST 7: Verify deleted production not in GET list")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/productions", timeout=10)
        
        if response.status_code != 200:
            print_test("GET after DELETE", False, f"Status {response.status_code}")
            return False
        
        data = response.json()
        found = any(item['id'] == production_id for item in data)
        
        if not found:
            print_test("Deleted production not in list", True, f"id {production_id} correctly removed")
            return True
        else:
            print_test("Deleted production not in list", False, f"id {production_id} still found")
            return False
            
    except Exception as e:
        print_test("GET after DELETE", False, f"Exception: {str(e)}")
        return False

def test_contact_post():
    """Test POST /api/contact - create contact message"""
    print("\n" + "="*80)
    print("TEST 8: POST /api/contact (create message)")
    print("="*80)
    
    try:
        contact_data = {
            "name": "Emma van der Berg",
            "email": "emma.vandenberg@example.nl",
            "subject": "Vraag over De Grote Sinterklaasshow",
            "message": "Ik zou graag meer informatie willen over de show voor volgend jaar. Zijn er al data bekend?"
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=contact_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_test("POST /api/contact", False, f"Expected 200, got {response.status_code}")
            return None
        
        data = response.json()
        print(f"Created contact: {json.dumps(data, indent=2)}")
        
        # Verify response has id
        if 'id' not in data:
            print_test("POST contact returns id", False, "No id in response")
            return None
        
        # Verify id is UUID
        if not isinstance(data['id'], str) or len(data['id']) < 32:
            print_test("POST contact returns UUID id", False, f"id: {data['id']}")
            return None
        
        # Verify _id is NOT present
        if '_id' in data:
            print_test("POST contact strips _id", False, "_id found in response")
            return None
        
        # Verify data matches input
        if data['name'] != contact_data['name']:
            print_test("POST contact preserves name", False, f"Expected {contact_data['name']}, got {data['name']}")
            return None
        
        if data['email'] != contact_data['email']:
            print_test("POST contact preserves email", False, f"Expected {contact_data['email']}, got {data['email']}")
            return None
        
        print_test("POST /api/contact", True, f"Created contact with id: {data['id']}")
        return data
        
    except Exception as e:
        print_test("POST /api/contact", False, f"Exception: {str(e)}")
        return None

def test_contact_post_validation():
    """Test POST /api/contact with missing required fields"""
    print("\n" + "="*80)
    print("TEST 9: POST /api/contact (missing required field - should return 400)")
    print("="*80)
    
    try:
        # Missing 'message' field
        invalid_data = {
            "name": "Test User",
            "email": "test@example.nl"
            # message is missing
        }
        
        response = requests.post(f"{BASE_URL}/contact", json=invalid_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            data = response.json()
            print(f"Error response: {json.dumps(data, indent=2)}")
            
            if 'error' in data:
                print_test("POST contact validation returns 400", True, f"Error message: {data['error']}")
                return True
            else:
                print_test("POST contact validation includes error", False, "No error field in response")
                return False
        else:
            print_test("POST contact validation returns 400", False, f"Expected 400, got {response.status_code}")
            return False
            
    except Exception as e:
        print_test("POST contact validation", False, f"Exception: {str(e)}")
        return False

def test_contact_get():
    """Test GET /api/contact - list messages"""
    print("\n" + "="*80)
    print("TEST 10: GET /api/contact (list messages)")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/contact", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_test("GET /api/contact", False, f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        print(f"Response type: {type(data)}")
        print(f"Number of messages: {len(data)}")
        
        # Verify it's an array
        if not isinstance(data, list):
            print_test("GET /api/contact returns array", False, f"Expected list, got {type(data)}")
            return False
        
        # If there are messages, verify structure
        if len(data) > 0:
            item = data[0]
            print(f"\nFirst message keys: {item.keys()}")
            
            # Verify _id is NOT present
            if '_id' in item:
                print_test("GET contact strips _id", False, "_id found in response")
                return False
            
            # Verify sorted by created_at desc (most recent first)
            if len(data) > 1:
                first_date = item.get('created_at')
                second_date = data[1].get('created_at')
                
                if first_date and second_date:
                    # Compare dates (should be descending)
                    if first_date < second_date:
                        print_test("GET contact sorted by created_at desc", False, "Not sorted correctly")
                        return False
                    else:
                        print_test("GET contact sorted by created_at desc", True, "Correctly sorted")
        
        print_test("GET /api/contact", True, f"Returns {len(data)} messages, no _id present")
        return True
        
    except Exception as e:
        print_test("GET /api/contact", False, f"Exception: {str(e)}")
        return False

def test_news_get_list():
    """Test GET /api/news - should return items array from external CMS"""
    print("\n" + "="*80)
    print("TEST 11: GET /api/news (proxy to external CMS)")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/news", timeout=15)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_test("GET /api/news", False, f"Expected 200, got {response.status_code}")
            return None
        
        data = response.json()
        print(f"Response type: {type(data)}")
        print(f"Response keys: {data.keys() if isinstance(data, dict) else 'Not a dict'}")
        
        # Verify it's an object with items array
        if not isinstance(data, dict):
            print_test("GET /api/news returns object", False, f"Expected dict, got {type(data)}")
            return None
        
        if 'items' not in data:
            print_test("GET /api/news has items field", False, f"Keys: {data.keys()}")
            return None
        
        if not isinstance(data['items'], list):
            print_test("GET /api/news items is array", False, f"items type: {type(data['items'])}")
            return None
        
        print(f"Number of items: {len(data['items'])}")
        
        # Verify structure of first item if available
        if len(data['items']) > 0:
            item = data['items'][0]
            print(f"\nFirst item keys: {item.keys()}")
            
            required_fields = ['id', 'title', 'image_url', 'published_at', 'category']
            missing_fields = [f for f in required_fields if f not in item]
            
            if missing_fields:
                print_test("News item has required fields", False, f"Missing: {missing_fields}")
                return None
            
            # Verify category has name
            if not isinstance(item['category'], dict) or 'name' not in item['category']:
                print_test("News item category has name", False, f"category: {item.get('category')}")
                return None
            
            print_test("GET /api/news structure", True, f"All fields valid")
        
        print_test("GET /api/news", True, f"Returns object with {len(data['items'])} items")
        return data
        
    except Exception as e:
        print_test("GET /api/news", False, f"Exception: {str(e)}")
        return None

def test_news_get_list_with_category():
    """Test GET /api/news?category=homepagina"""
    print("\n" + "="*80)
    print("TEST 12: GET /api/news?category=homepagina")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/news?category=homepagina", timeout=15)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_test("GET /api/news?category=homepagina", False, f"Expected 200, got {response.status_code}")
            return None
        
        data = response.json()
        
        # Verify same structure as without category
        if not isinstance(data, dict) or 'items' not in data:
            print_test("GET /api/news?category structure", False, f"Invalid structure")
            return None
        
        if not isinstance(data['items'], list):
            print_test("GET /api/news?category items is array", False, f"items type: {type(data['items'])}")
            return None
        
        print(f"Number of items: {len(data['items'])}")
        print_test("GET /api/news?category=homepagina", True, f"Returns {len(data['items'])} items")
        return data
        
    except Exception as e:
        print_test("GET /api/news?category=homepagina", False, f"Exception: {str(e)}")
        return None

def test_news_get_article(article_id):
    """Test GET /api/news/{id} - get full article"""
    print("\n" + "="*80)
    print(f"TEST 13: GET /api/news/{article_id} (full article)")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/news/{article_id}", timeout=15)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print_test("GET /api/news/{id}", False, f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        print(f"Response type: {type(data)}")
        print(f"Response keys: {data.keys() if isinstance(data, dict) else 'Not a dict'}")
        
        # Verify it's an object
        if not isinstance(data, dict):
            print_test("GET /api/news/{id} returns object", False, f"Expected dict, got {type(data)}")
            return False
        
        # Verify required fields including body
        required_fields = ['title', 'image_url', 'published_at', 'category', 'body']
        missing_fields = [f for f in required_fields if f not in data]
        
        if missing_fields:
            print_test("Article has required fields", False, f"Missing: {missing_fields}")
            return False
        
        # Verify body is a string (HTML)
        if not isinstance(data['body'], str):
            print_test("Article body is string", False, f"body type: {type(data['body'])}")
            return False
        
        print(f"Body length: {len(data['body'])} characters")
        print_test("GET /api/news/{id}", True, f"Returns full article with body field")
        return True
        
    except Exception as e:
        print_test("GET /api/news/{id}", False, f"Exception: {str(e)}")
        return False

def test_news_get_article_not_found():
    """Test GET /api/news/nonexistent-id - should return error"""
    print("\n" + "="*80)
    print("TEST 14: GET /api/news/nonexistent-id-123 (should return error)")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/news/nonexistent-id-123", timeout=15)
        print(f"Status Code: {response.status_code}")
        
        # Should be non-200 (404 or 502)
        if response.status_code == 200:
            print_test("GET /api/news/invalid-id returns error status", False, f"Got 200, expected 404 or 502")
            return False
        
        if response.status_code not in [404, 502]:
            print_test("GET /api/news/invalid-id returns 404 or 502", False, f"Got {response.status_code}")
            return False
        
        data = response.json()
        print(f"Error response: {json.dumps(data, indent=2)}")
        
        # Verify error field is present
        if 'error' not in data:
            print_test("Error response has error field", False, f"Response: {data}")
            return False
        
        print_test("GET /api/news/invalid-id", True, f"Returns {response.status_code} with error field")
        return True
        
    except Exception as e:
        print_test("GET /api/news/invalid-id", False, f"Exception: {str(e)}")
        return False

def test_sanity_productions():
    """Quick sanity check that productions endpoint still works"""
    print("\n" + "="*80)
    print("SANITY CHECK: GET /api/productions")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/productions", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_test("Sanity: GET /api/productions", True, f"Returns array with {len(data)} items")
                return True
        
        print_test("Sanity: GET /api/productions", False, f"Status {response.status_code}")
        return False
        
    except Exception as e:
        print_test("Sanity: GET /api/productions", False, f"Exception: {str(e)}")
        return False

def test_sanity_contact():
    """Quick sanity check that contact endpoint still works"""
    print("\n" + "="*80)
    print("SANITY CHECK: GET /api/contact")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/contact", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print_test("Sanity: GET /api/contact", True, f"Returns array with {len(data)} items")
                return True
        
        print_test("Sanity: GET /api/contact", False, f"Status {response.status_code}")
        return False
        
    except Exception as e:
        print_test("Sanity: GET /api/contact", False, f"Exception: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print("\n" + "="*80)
    print("STUDIO WONDERLAND BACKEND API TEST SUITE")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test started at: {datetime.now().isoformat()}")
    
    results = {
        'total': 0,
        'passed': 0,
        'failed': 0
    }
    
    # Test News API (NEW - main focus)
    print("\n\n" + "="*80)
    print("NEWS PROXY API TESTS (NEW)")
    print("="*80)
    
    # Test 11: GET /api/news
    news_data = test_news_get_list()
    results['total'] += 1
    if news_data is not None:
        results['passed'] += 1
        
        # Test 12: GET /api/news?category=homepagina
        results['total'] += 1
        if test_news_get_list_with_category():
            results['passed'] += 1
        else:
            results['failed'] += 1
        
        # Test 13: GET /api/news/{id} - use first item's id
        if news_data.get('items') and len(news_data['items']) > 0:
            article_id = news_data['items'][0].get('id')
            if article_id:
                results['total'] += 1
                if test_news_get_article(article_id):
                    results['passed'] += 1
                else:
                    results['failed'] += 1
            else:
                print("⚠️  Warning: No article id found in first item, skipping article test")
        else:
            print("⚠️  Warning: No items in news list, skipping article test")
        
        # Test 14: GET /api/news/nonexistent-id
        results['total'] += 1
        if test_news_get_article_not_found():
            results['passed'] += 1
        else:
            results['failed'] += 1
    else:
        results['failed'] += 1
        print("⚠️  Skipping remaining news tests due to list failure")
    
    # Sanity checks for existing endpoints
    print("\n\n" + "="*80)
    print("SANITY CHECKS (existing endpoints)")
    print("="*80)
    
    # Sanity: Productions
    results['total'] += 1
    if test_sanity_productions():
        results['passed'] += 1
    else:
        results['failed'] += 1
    
    # Sanity: Contact
    results['total'] += 1
    if test_sanity_contact():
        results['passed'] += 1
    else:
        results['failed'] += 1
    
    # Final summary
    print("\n\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    print(f"Total Tests: {results['total']}")
    print(f"Passed: {results['passed']} ✅")
    print(f"Failed: {results['failed']} ❌")
    print(f"Success Rate: {(results['passed']/results['total']*100):.1f}%")
    print(f"Test completed at: {datetime.now().isoformat()}")
    
    # Exit with appropriate code
    sys.exit(0 if results['failed'] == 0 else 1)

if __name__ == "__main__":
    main()
