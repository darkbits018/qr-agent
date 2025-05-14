import pytest
import os

if __name__ == '__main__':
    # Generate Allure results
    pytest.main(['tests', '-v', '--alluredir=allure-results'])

    # Serve Allure report (requires Allure to be installed)
    os.system('allure serve allure-results')
