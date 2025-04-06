#include <iostream>
using namespace std;

// Node structure for AVL Tree
struct AVLNode {
    int data, height;
    AVLNode *left, *right;
    
    AVLNode(int val) : data(val), height(1), left(NULL), right(NULL) {}
};

// Get height of a node
int getHeight(AVLNode* node) {
    return node ? node->height : 0;
}

// Update height of a node
void updateHeight(AVLNode* node) {
    if (node)
        node->height = 1 + max(getHeight(node->left), getHeight(node->right));
}

// Get balance factor of a node
int getBalance(AVLNode* node) {
    return node ? getHeight(node->left) - getHeight(node->right) : 0;
}

// Right Rotation (for Left-Heavy case)
AVLNode* rightRotate(AVLNode* y) {
    AVLNode* x = y->left;
    AVLNode* T2 = x->right;

    x->right = y;
    y->left = T2;

    updateHeight(y);
    updateHeight(x);

    return x;
}

// Left Rotation (for Right-Heavy case)
AVLNode* leftRotate(AVLNode* x) {
    AVLNode* y = x->right;
    AVLNode* T2 = y->left;

    y->left = x;
    x->right = T2;

    updateHeight(x);
    updateHeight(y);

    return y;
}

// Insert a node in AVL Tree
AVLNode* insert(AVLNode* root, int data) {
    if (!root) return new AVLNode(data);

    if (data < root->data)
        root->left = insert(root->left, data);
    else if (data > root->data)
        root->right = insert(root->right, data);
    else
        return root; // Duplicates are not allowed

    updateHeight(root);
    int balance = getBalance(root);

    // Rotation Cases
    if (balance > 1 && data < root->left->data) return rightRotate(root);    // Left-Left
    if (balance < -1 && data > root->right->data) return leftRotate(root);   // Right-Right
    if (balance > 1 && data > root->left->data) {                            // Left-Right
        root->left = leftRotate(root->left);
        return rightRotate(root);
    }
    if (balance < -1 && data < root->right->data) {                          // Right-Left
        root->right = rightRotate(root->right);
        return leftRotate(root);
    }

    return root;
}

// Get node with the smallest value (inorder successor)
AVLNode* minValueNode(AVLNode* node) {
    while (node->left) node = node->left;
    return node;
}

// Delete a node from AVL Tree
AVLNode* deleteNode(AVLNode* root, int data) {
    if (!root) return NULL;

    if (data < root->data)
        root->left = deleteNode(root->left, data);
    else if (data > root->data)
        root->right = deleteNode(root->right, data);
    else {
        // Node with one or no child
        if (!root->left || !root->right) {
            AVLNode* temp = root->left ? root->left : root->right;
            delete root;
            return temp;
        }
        // Node with two children: Get inorder successor
        AVLNode* temp = minValueNode(root->right);
        root->data = temp->data;
        root->right = deleteNode(root->right, temp->data);
    }

    updateHeight(root);
    int balance = getBalance(root);

    // Rotation Cases
    if (balance > 1 && getBalance(root->left) >= 0) return rightRotate(root);  // Left-Left
    if (balance > 1 && getBalance(root->left) < 0) {                           // Left-Right
        root->left = leftRotate(root->left);
        return rightRotate(root);
    }
    if (balance < -1 && getBalance(root->right) <= 0) return leftRotate(root); // Right-Right
    if (balance < -1 && getBalance(root->right) > 0) {                         // Right-Left
        root->right = rightRotate(root->right);
        return leftRotate(root);
    }

    return root;
}

// Inorder Traversal (Sorted Order)
void inorder(AVLNode* root) {
    if (root) {
        inorder(root->left);
        cout << root->data << " ";
        inorder(root->right);
    }
}

int main() {
    AVLNode* root = NULL;

    // Insert nodes
    root = insert(root, 30);
    root = insert(root, 20);
    root = insert(root, 40);
    root = insert(root, 10);
    root = insert(root, 25);
    root = insert(root, 35);
    root = insert(root, 50);

    cout << "Inorder traversal before deletion: ";
    inorder(root);
    cout << endl;

    // Delete a node
    root = deleteNode(root, 40);

    cout << "Inorder traversal after deletion: ";
    inorder(root);
    cout << endl;

    return 0;
}
