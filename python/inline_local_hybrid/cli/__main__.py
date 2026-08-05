import os
import sys

import pulumi

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from infra import website_deploy


pulumi.run(website_deploy)
