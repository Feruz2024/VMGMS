from django.test import TestCase
from users.models import User
from .models import Part, StockAdjustmentLog

class PartModelTest(TestCase):
    def test_create_part_success(self):
        part = Part.objects.create(
            part_number="P1234",
            description="Oil Filter",
            selling_price=10.00,
            cost_price=5.00,
            quantity_on_hand=100
        )
        self.assertEqual(part.part_number, "P1234")
        self.assertEqual(part.quantity_on_hand, 100)

    def test_required_fields(self):
        with self.assertRaises(Exception):
            Part.objects.create(
                part_number="",
                selling_price=None,
                cost_price=None
            )

class StockAdjustmentLogModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='stockuser', password='stockpass')
        self.part = Part.objects.create(
            part_number="P5678",
            description="Brake Pad",
            selling_price=30.00,
            cost_price=15.00,
            quantity_on_hand=50
        )

    def test_create_stock_adjustment_log_success(self):
        log = StockAdjustmentLog.objects.create(
            part=self.part,
            user=self.user,
            adjustment_amount=10,
            new_qoh=60,
            reason="Restock"
        )
        self.assertEqual(log.part, self.part)
        self.assertEqual(log.new_qoh, 60)
        self.assertEqual(log.reason, "Restock")

    def test_required_fields(self):
        with self.assertRaises(Exception):
            StockAdjustmentLog.objects.create(
                part=None,
                adjustment_amount=None,
                new_qoh=None,
                reason=""
            )
